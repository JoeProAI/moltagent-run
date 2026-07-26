// Real M.E.C.H.A. Quad Crew debate, powered by Grok (xAI API).
// Four sequential Grok calls — PILOT plans, HARPER researches, BENJAMIN
// attacks, LUCAS executes — each seeing the transcript so far.
// Requires XAI_API_KEY in Vercel env. Model defaults to grok-4-fast
// (xAI routes retired names to the current generation); override with XAI_MODEL.
export const config = { maxDuration: 60 };

const XAI_URL = 'https://api.x.ai/v1/chat/completions';

const CREW = [
  {
    role: 'PILOT',
    system:
      'You are PILOT, the leader of the M.E.C.H.A. Quad Crew (four Grok agents debating an engineering task). ' +
      'Break the task into a concrete plan of 3-4 steps and state the key decision to debate. ' +
      'Direct, technical, no fluff, no emoji. Maximum 3 sentences.'
  },
  {
    role: 'HARPER',
    system:
      'You are HARPER, the researcher of the M.E.C.H.A. Quad Crew. Given the task and PILOT\'s plan, ' +
      'surface the 2-3 most relevant technical facts, constraints, or prior art that change the approach. ' +
      'Concrete and specific, no fluff, no emoji. Maximum 3 sentences.'
  },
  {
    role: 'BENJAMIN',
    system:
      'You are BENJAMIN, the critic of the M.E.C.H.A. Quad Crew. Attack the plan so far: name the single ' +
      'biggest risk or wrong assumption and how it fails in practice. Blunt, technical, no emoji. Maximum 3 sentences.'
  },
  {
    role: 'LUCAS',
    system:
      'You are LUCAS, the executor of the M.E.C.H.A. Quad Crew. Synthesize the debate into the final verdict: ' +
      'what to build and the first concrete action to take, folding in BENJAMIN\'s objection. ' +
      'Decisive, technical, no emoji. Maximum 3 sentences.'
  }
];

async function grokTurn(apiKey, model, system, transcript, task) {
  const messages = [
    { role: 'system', content: system },
    {
      role: 'user',
      content:
        `Task: ${task}\n\n` +
        (transcript.length
          ? `Debate so far:\n${transcript.map(t => `${t.role}: ${t.msg}`).join('\n')}`
          : 'You open the debate.')
    }
  ];

  const response = await fetch(XAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, messages, max_tokens: 220, temperature: 0.7 })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`xAI ${response.status}: ${detail.slice(0, 200)}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '(no response)';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(501).json({
      success: false,
      error: 'NOT_CONFIGURED',
      message: 'Set XAI_API_KEY in Vercel env to run the live Grok debate.'
    });
  }

  const { task } = req.body || {};
  if (!task || typeof task !== 'string' || task.length > 1000) {
    return res.status(400).json({ success: false, message: 'Provide a task under 1000 chars.' });
  }

  const model = process.env.XAI_MODEL || 'grok-4-fast';
  const transcript = [];

  try {
    for (const member of CREW) {
      const msg = await grokTurn(apiKey, model, member.system, transcript, task);
      transcript.push({ role: member.role, msg });
    }
    return res.status(200).json({ success: true, transcript, model });
  } catch (err) {
    return res.status(502).json({
      success: false,
      message: `Debate failed after ${transcript.length} turns: ${err.message}`,
      transcript
    });
  }
}
