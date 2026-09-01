// POST /api/devin-outposts — Devin Outpost fleet API (opbeta)
//
// Endpoints:
//   POST   /api/devin-outposts          action=status      → outpost + queue state
//   POST   /api/devin-outposts          action=dispatch    → queue a new session
//   POST   /api/devin-outposts          action=terminate   → cancel a running session
//   POST   /api/devin-outposts          action=claim       → claim a queued session (orchestrator use)
//   POST   /api/devin-outposts          action=release     → release a claim (orchestrator use)
//
// This file speaks the 2026 fleet API at https://api.devin.ai/opbeta/outposts/.
// The actual worker lifecycle (containers, VMs, Kubernetes) is handled by the
// operator's infrastructure. This API reads queue state and issues commands.
//
// Requires these env vars in Vercel:
//   DEVIN_OUTPOSTS_TOKEN   — v3 service user token with ReadOutposts/WriteOutposts scopes
//   DEVIN_API_URL          — https://api.devin.ai (optional override)
//   OUTPOST_ID             — the outpost ID (outpost_env-...) or name

const DEVIN_API = process.env.DEVIN_API_URL || 'https://api.devin.ai';

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

// ---------------------------------------------------------------------------
// Action: status — return outpost metadata + queue state (opbeta fleet API)
// ---------------------------------------------------------------------------
async function handleStatus() {
  if (!process.env.OUTPOST_ID || !process.env.DEVIN_OUTPOSTS_TOKEN) {
    return {
      configured: false,
      message: 'Devin Outposts not configured. Set DEVIN_OUTPOSTS_TOKEN and OUTPOST_ID in Vercel env.',
    };
  }

  const outpostId = process.env.OUTPOST_ID;

  // Fetch outpost metadata
  let outpost = null;
  try {
    outpost = await devinFetch(`/opbeta/outposts/${outpostId}`);
  } catch {
    // Outpost might not exist or token lacks read scope
  }

  // Fetch queue state from the fleet API (K8s-style list)
  const queue = await devinFetch(
    `/opbeta/outposts/devins?outpost=${encodeURIComponent(outpostId)}&first=100`
  ).catch(() => null);

  // Map the opbeta response to the UI's expected shape
  const sessions = (queue?.items || []).map((entry) => ({
    sessionId: entry.metadata?.session_id,
    outpostId: entry.metadata?.outpost_id,
    kind: entry.spec?.kind,
    platform: entry.spec?.platform,
    phase: entry.status?.phase,
    acceptorId: entry.status?.acceptor_id || null,
    sessionStatus: entry.status?.session_status,
    claimDeadline: entry.status?.claim_deadline,
    createdAt: entry.metadata?.created_at,
    updatedAt: entry.metadata?.updated_at,
  }));

  const claimedCount = sessions.filter((s) => s.phase === 'claimed').length;
  const pendingCount = sessions.filter((s) => s.phase === 'pending').length;

  return {
    configured: true,
    outpostId,
    outpostName: outpost?.spec?.name || outpostId,
    platform: outpost?.spec?.platform || 'linux',
    description: outpost?.spec?.description || null,
    queueDepth: outpost?.status?.queue_depth ?? pendingCount,
    activeClaims: outpost?.status?.active_claims ?? claimedCount,
    queue: {
      total: sessions.length,
      pending: pendingCount,
      claimed: claimedCount,
      sessions,
      cursor: queue?.cursor || null,
      hasNextPage: queue?.has_next_page || false,
    },
  };
}

// ---------------------------------------------------------------------------
// Action: dispatch — create a new Devin session targeting this outpost
// ---------------------------------------------------------------------------
async function handleDispatch(body) {
  const { prompt, repo } = body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return { success: false, error: 'Provide a prompt under 4000 chars.' };
  }

  if (!process.env.DEVIN_OUTPOSTS_TOKEN || !process.env.OUTPOST_ID) {
    return { success: false, error: 'Devin Outposts not configured.' };
  }

  // Check queue depth before dispatching
  const status = await handleStatus();
  const pending = status.queue?.pending || 0;
  const maxQueued = parseInt(process.env.MAX_QUEUED_SESSIONS || '20', 10);

  if (pending >= maxQueued) {
    return {
      success: false,
      error: `Queue full: ${pending} pending, max=${maxQueued}. Wait for workers to claim sessions.`,
    };
  }

  // Create the session via Devin Sessions API (this queues it on the outpost)
  // Sessions API is still at /v1/sessions; the fleet API is for queue management
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
    message: `Session ${session.id} queued on outpost. A worker will claim it when available.`,
  };
}

// ---------------------------------------------------------------------------
// Action: terminate — cancel a running session
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
// Action: claim — atomically claim a session (for orchestrators)
// ---------------------------------------------------------------------------
async function handleClaim(body) {
  const { sessionId, acceptorId } = body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Provide a sessionId to claim.' };
  }
  if (!acceptorId || typeof acceptorId !== 'string') {
    return { success: false, error: 'Provide an acceptorId (worker identity).' };
  }

  if (!process.env.DEVIN_OUTPOSTS_TOKEN) {
    return { success: false, error: 'Devin Outposts not configured.' };
  }

  try {
    const result = await devinFetch(`/opbeta/outposts/devins/${sessionId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ acceptor_id: acceptorId }),
    });

    return {
      success: true,
      sessionId,
      acceptorId,
      connectToken: result.status?.connect_token,
      gatewayUrl: result.status?.gateway_url,
      claimDeadline: result.status?.claim_deadline,
      message: `Session ${sessionId} claimed by ${acceptorId}.`,
    };
  } catch (err) {
    const is409 = err.message.includes('409');
    return {
      success: false,
      error: is409 ? 'Session already claimed by another worker.' : `Claim failed: ${err.message}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Action: release — release a claim so the session returns to the queue
// ---------------------------------------------------------------------------
async function handleRelease(body) {
  const { sessionId, acceptorId } = body || {};

  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Provide a sessionId to release.' };
  }
  if (!acceptorId || typeof acceptorId !== 'string') {
    return { success: false, error: 'Provide the acceptorId that holds the claim.' };
  }

  if (!process.env.DEVIN_OUTPOSTS_TOKEN) {
    return { success: false, error: 'Devin Outposts not configured.' };
  }

  try {
    await devinFetch(`/opbeta/outposts/devins/${sessionId}/release`, {
      method: 'POST',
      body: JSON.stringify({ acceptor_id: acceptorId }),
    });
    return { success: true, sessionId, message: `Claim on ${sessionId} released.` };
  } catch (err) {
    return { success: false, error: `Release failed: ${err.message}` };
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
      case 'dispatch':
        return res.status(200).json(await handleDispatch(body));
      case 'terminate':
        return res.status(200).json(await handleTerminate(body));
      case 'claim':
        return res.status(200).json(await handleClaim(body));
      case 'release':
        return res.status(200).json(await handleRelease(body));
      default:
        return res.status(400).json({
          success: false,
          message: 'Unknown action. Use: status, dispatch, terminate, claim, release.',
        });
    }
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: err.message,
      note: 'Check that your DEVIN_OUTPOSTS_TOKEN has the required scopes (ReadOutposts/WriteOutposts).',
    });
  }
}

export const config = { maxDuration: 30 };
