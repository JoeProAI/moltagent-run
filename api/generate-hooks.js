import Anthropic from '@anthropic-ai/sdk';

export const config = { maxDuration: 60 };

const XAI_URL = 'https://api.x.ai/v1/chat/completions';

const THREAD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tweets'],
  properties: {
    tweets: {
      type: 'array',
      items: {
        type: 'string',
        description: 'One tweet in the thread, numbered n/5, under 280 chars'
      }
    }
  }
};

const HOOK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['hooks'],
  properties: {
    hooks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'retentionScore', 'viralIndex', 'angle'],
        properties: {
          text: { type: 'string', description: 'The tweet hook, under 280 chars' },
          retentionScore: { type: 'number', description: 'Predicted read-through 0-100' },
          viralIndex: { type: 'number', description: 'Viral signal 0-10' },
          angle: { type: 'string', description: 'The psychological angle used, 2-4 words' }
        }
      }
    }
  }
};

const HOOK_SYSTEM =
  'You write opening hooks for X (Twitter) posts by @JoePro, an AI developer who ships multi-agent systems in public. ' +
  'Voice: direct, technical, contrarian, zero fluff, no emoji, no hashtags. ' +
  'Each hook must use a distinct psychological angle (curiosity gap, contrarian claim, concrete number, status play, story open, etc). ' +
  'Score honestly: retentionScore is predicted read-through 0-100, viralIndex is 0-10.';

const THREAD_SYSTEM =
  'You expand a draft post into a 5-tweet X thread for @JoePro, an AI developer who ships multi-agent systems in public. ' +
  'Voice: direct, technical, concrete, zero fluff, no emoji, no hashtags. ' +
  'Tweet 1 is the hook (may closely follow the draft), tweets 2-4 deliver substance with specifics, tweet 5 closes with a call to action. ' +
  'Number each tweet n/5. Every tweet under 280 characters.';

// Grok path — xAI's API is OpenAI-compatible; structured output via response_format.
async function grokGenerate(system, user, schema, schemaName) {
  const response = await fetch(XAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || 'grok-4-fast',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: schemaName, schema, strict: true }
      },
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`xAI ${response.status}: ${detail.slice(0, 200)}`);
  }
  const data = await response.json();
  return { parsed: JSON.parse(data.choices[0].message.content), model: data.model };
}

// Claude fallback path.
async function claudeGenerate(system, user, schema, maxTokens) {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: maxTokens,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema }
    },
    system,
    messages: [{ role: 'user', content: user }]
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Generation declined.');
  }
  const textBlock = response.content.find((b) => b.type === 'text');
  return { parsed: JSON.parse(textBlock.text), model: response.model };
}

// Generates tweet hooks (mode: 'hooks') or expands a thread (mode: 'thread').
// Engine: Grok via XAI_API_KEY when set (Joe's primary), Claude via
// ANTHROPIC_API_KEY as fallback; honest 501 when neither is configured.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  const hasGrok = Boolean(process.env.XAI_API_KEY);
  const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY);
  if (!hasGrok && !hasClaude) {
    return res.status(501).json({
      success: false,
      error: 'NOT_CONFIGURED',
      message: 'Set XAI_API_KEY (Grok) or ANTHROPIC_API_KEY (Claude) in Vercel env to enable live generation.'
    });
  }

  const { topic, count = 25, mode = 'hooks' } = req.body || {};
  if (!topic || typeof topic !== 'string' || topic.length > 1000) {
    return res.status(400).json({ success: false, message: 'Provide a topic under 1000 chars.' });
  }
  const n = Math.min(Math.max(Number(count) || 25, 5), 25);

  const isThread = mode === 'thread';
  const system = isThread ? THREAD_SYSTEM : HOOK_SYSTEM;
  const user = isThread
    ? `Expand this draft into a 5-tweet thread:\n\n${topic}`
    : `Generate ${n} distinct viral tweet hooks for this topic:\n\n${topic}`;
  const schema = isThread ? THREAD_SCHEMA : HOOK_SCHEMA;

  try {
    let result;
    if (hasGrok) {
      try {
        result = await grokGenerate(system, user, schema, isThread ? 'thread' : 'hooks');
      } catch (grokErr) {
        if (!hasClaude) throw grokErr;
        console.error('Grok failed, falling back to Claude:', grokErr.message);
        result = await claudeGenerate(system, user, schema, isThread ? 4000 : 8000);
      }
    } else {
      result = await claudeGenerate(system, user, schema, isThread ? 4000 : 8000);
    }

    if (isThread) {
      return res.status(200).json({ success: true, tweets: result.parsed.tweets, model: result.model });
    }
    const hooks = result.parsed.hooks.sort((a, b) => b.retentionScore - a.retentionScore);
    return res.status(200).json({ success: true, hooks, winner: hooks[0], model: result.model });
  } catch (err) {
    return res.status(502).json({ success: false, message: `Generation error: ${err.message}` });
  }
}
