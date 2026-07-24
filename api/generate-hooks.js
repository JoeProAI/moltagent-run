import Anthropic from '@anthropic-ai/sdk';

export const config = { maxDuration: 60 };

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

// Generates N tweet-hook variants for a topic and scores them.
// Requires ANTHROPIC_API_KEY in Vercel env; the client returns 501 gracefully otherwise.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(501).json({
      success: false,
      error: 'NOT_CONFIGURED',
      message: 'Set ANTHROPIC_API_KEY in Vercel env to enable live hook generation.'
    });
  }

  const { topic, count = 25 } = req.body || {};
  if (!topic || typeof topic !== 'string' || topic.length > 500) {
    return res.status(400).json({ success: false, message: 'Provide a topic under 500 chars.' });
  }
  const n = Math.min(Math.max(Number(count) || 25, 5), 25);

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: HOOK_SCHEMA }
      },
      system:
        'You write opening hooks for X (Twitter) posts by @JoePro, an AI developer who ships multi-agent systems in public. ' +
        'Voice: direct, technical, contrarian, zero fluff, no emoji, no hashtags. ' +
        'Each hook must use a distinct psychological angle (curiosity gap, contrarian claim, concrete number, status play, story open, etc). ' +
        'Score honestly: retentionScore is predicted read-through 0-100, viralIndex is 0-10.',
      messages: [
        { role: 'user', content: `Generate ${n} distinct viral tweet hooks for this topic:\n\n${topic}` }
      ]
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ success: false, message: 'Generation declined for this topic.' });
    }

    const textBlock = response.content.find((b) => b.type === 'text');
    const parsed = JSON.parse(textBlock.text);
    const hooks = parsed.hooks.sort((a, b) => b.retentionScore - a.retentionScore);

    return res.status(200).json({
      success: true,
      hooks,
      winner: hooks[0],
      model: response.model
    });
  } catch (err) {
    return res.status(502).json({ success: false, message: `Generation error: ${err.message}` });
  }
}
