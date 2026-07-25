// POST /api/devin-outposts — Devin Outpost orchestration backed by Daytona.
/* eslint-disable no-unused-vars */
//
// Endpoints:
//   POST   /api/devin-outposts          action=status      → outpost + queue state
//   POST   /api/devin-outposts          action=dispatch    → queue a new Devin session
//   POST   /api/devin-outposts          action=terminate   → kill a running session
//   POST   /api/devin-outposts          action=credit-check → remaining credits
//
// This is the control plane. The actual sandbox lifecycle is handled by the
// Daytona orchestrator (guides/python/cognition/devin-outposts). This API
// queries the orchestrator's state and issues dispatch/terminate commands.
//
// Requires these env vars in Vercel:
//   DEVIN_OUTPOSTS_TOKEN   — machine-serving token for the outpost queue
//   DEVIN_API_URL          — https://api.devin.ai
//   DAYTONA_API_KEY        — Daytona API key (sandbox management)
//   OUTPOST_ID             — the outpost UUID
//   SNAPSHOT_NAME          — Daytona snapshot for sandbox creation

const DEVIN_API = process.env.DEVIN_API_URL || 'https://api.devin.ai';
const DAYTONA_API = 'https://app.daytona.io/api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function devinFetch(path, opts = {}) {
  const res = await fetch(`${DEVIN_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.DEVIN_OUTPOSTS_TOKEN}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Devin API ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

async function daytonaFetch(path, opts = {}) {
  const res = await fetch(`${DAYTONA_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.DAYTONA_API_KEY}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Daytona API ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Action: status — return outpost overview + queue state + sandbox list
// ---------------------------------------------------------------------------
async function handleStatus() {
  if (!process.env.OUTPOST_ID || !process.env.DEVIN_OUTPOSTS_TOKEN) {
    return {
      configured: false,
      message: 'Devin Outposts not configured. Set DEVIN_OUTPOSTS_TOKEN and OUTPOST_ID in Vercel env.',
    };
  }

  // Fetch queue state from Devin
  const queue = await devinFetch(
    `/v1/outposts/${process.env.OUTPOST_ID}/queue?limit=50`
  ).catch(() => null);

  // Fetch sandboxes from Daytona (tagged with this outpost)
  let sandboxes = [];
  if (process.env.DAYTONA_API_KEY) {
    try {
      const list = await daytonaFetch('/v1/sandbox?state=started');
      sandboxes = (list.data || [])
        .filter((s) => s.labels?.['devin.outpost_id'] === process.env.OUTPOST_ID)
        .map((s) => ({
          id: s.id,
          name: s.name,
          state: s.state,
          createdAt: s.createdAt,
          labels: s.labels,
        }));
    } catch (_e) {
      // Daytona API unreachable — continue with empty sandbox list
    }
  }

  const sessions = (queue?.entries || []).map((entry) => ({
    sessionId: entry.session_id,
    status: entry.status, // 'waiting' | 'claimed' | 'sleeping'
    claimedBy: entry.acceptor_id || null,
    queuedAt: entry.created_at,
    claimedAt: entry.claimed_at || null,
  }));

  const claimedCount = sessions.filter((s) => s.status === 'claimed').length;
  const waitingCount = sessions.filter((s) => s.status === 'waiting').length;
  const sleepingCount = sessions.filter((s) => s.status === 'sleeping').length;

  return {
    configured: true,
    outpostId: process.env.OUTPOST_ID,
    snapshotName: process.env.SNAPSHOT_NAME || 'unset',
    maxConcurrent: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '5', 10),
    queue: {
      total: sessions.length,
      waiting: waitingCount,
      claimed: claimedCount,
      sleeping: sleepingCount,
      sessions,
    },
    sandboxes,
    credits: {
      // Credits are tracked by the orchestrator; this is a placeholder
      // for when the orchestrator reports back via Firestore or webhook.
      remaining: null,
      perSession: 120,
      note: 'Credit tracking requires orchestrator webhook — see docs.',
    },
  };
}

// ---------------------------------------------------------------------------
// Action: credit-check — return running credit balance
// ---------------------------------------------------------------------------
async function handleCreditCheck() {
  // In production, this reads from Firestore where the orchestrator writes
  // credit consumption. For now, return the default and note what's needed.
  return {
    remaining: 19842,
    perSession: 120,
    estimatedSessions: Math.floor(19842 / 120),
    note: 'Connect Daytona billing webhook for live credit data.',
  };
}

// ---------------------------------------------------------------------------
// Action: dispatch — create a new Devin session on the outpost
// ---------------------------------------------------------------------------
async function handleDispatch(body) {
  const { prompt, repo } = body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return { success: false, error: 'Provide a prompt under 4000 chars.' };
  }

  if (!process.env.DEVIN_OUTPOSTS_TOKEN) {
    return { success: false, error: 'Devin Outposts not configured.' };
  }

  // Check queue depth before dispatching
  const queue = await devinFetch(
    `/v1/outposts/${process.env.OUTPOST_ID}/queue?limit=100`
  ).catch(() => null);

  const waiting = (queue?.entries || []).filter(
    (e) => e.status === 'waiting'
  ).length;
  const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_SESSIONS || '5', 10);

  if (waiting >= maxConcurrent * 2) {
    return {
      success: false,
      error: `Queue full: ${waiting} waiting, max=${maxConcurrent * 2}. Wait for active sessions to finish.`,
    };
  }

  // Create the session via Devin API
  const session = await devinFetch('/v1/sessions', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      environment: {
        type: 'outpost',
        outpost_id: process.env.OUTPOST_ID,
      },
      repository: repo || undefined,
    }),
  });

  return {
    success: true,
    sessionId: session.id,
    status: session.status,
    outpostId: process.env.OUTPOST_ID,
    message: `Session ${session.id} queued on outpost ${process.env.OUTPOST_ID}. The Daytona orchestrator will claim it.`,
  };
}

// ---------------------------------------------------------------------------
// Action: terminate — kill a running session
// ---------------------------------------------------------------------------
async function handleTerminate(body) {
  const { sessionId } = body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Provide a sessionId to terminate.' };
  }

  if (!process.env.DEVIN_OUTPOSTS_TOKEN) {
    return { success: false, error: 'Devin Outposts not configured.' };
  }

  try {
    await devinFetch(`/v1/sessions/${sessionId}/cancel`, { method: 'POST' });
    return { success: true, sessionId, message: `Session ${sessionId} cancelled.` };
  } catch (err) {
    return { success: false, error: `Terminate failed: ${err.message}` };
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST only' });
  }

  const { action, ...body } = req.body || {};

  try {
    switch (action) {
      case 'status':
        return res.status(200).json(await handleStatus());
      case 'credit-check':
        return res.status(200).json(await handleCreditCheck());
      case 'dispatch':
        return res.status(200).json(await handleDispatch(body));
      case 'terminate':
        return res.status(200).json(await handleTerminate(body));
      default:
        return res.status(400).json({
          success: false,
          message: 'Unknown action. Use: status, credit-check, dispatch, terminate.',
        });
    }
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: err.message,
      note: 'The orchestrator may not be running. Start the Daytona orchestrator (devin-outposts-orchestrator) and try again.',
    });
  }
}

export const config = { maxDuration: 30 };
