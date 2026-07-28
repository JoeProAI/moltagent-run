import { Daytona } from '@daytonaio/sdk';

// Outpost gateway — the "easy mode" for spinning up Daytona sandboxes without
// anyone needing their own Daytona account. Joe's org key stays server-side;
// visitors authenticate with their Firebase session and get a capped, labeled,
// auto-expiring sandbox. Optional: pass a Devin outpost token and it's injected
// as an env var into THEIR sandbox (used once, never stored) so the outpost
// registers into their own Devin org.
//
// Env: DAYTONA_API_KEY (required)
//      DAYTONA_SNAPSHOT (optional snapshot name for pre-baked outpost image)
//      OUTPOST_MAX_PER_USER (default 2)
//      OUTPOST_AUTO_STOP_MIN (default 15)
//      OUTPOST_AUTO_DELETE_MIN (default 120)
//      OUTPOST_PRIVATE_MODE (default true) and OUTPOST_OPERATOR_UIDS (required while private)
export const config = { maxDuration: 60 };

const OWNER_LABEL = 'moltagent-owner';
// Same public web key the client ships; used only to have Google verify ID tokens.
const FIREBASE_WEB_KEY = 'AIzaSyCmh0BfMmvRaGaWeD0RX3xBX5ifbjIzJMY';

async function verifyUser(req) {
  const header = req.headers.authorization || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!idToken) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.users?.[0]?.localId || null;
}

function publicView(sandbox) {
  return {
    id: sandbox.id,
    state: sandbox.state,
    snapshot: sandbox.snapshot || null,
    createdAt: sandbox.createdAt || null,
    autoStopInterval: sandbox.autoStopInterval,
    autoDeleteInterval: sandbox.autoDeleteInterval
  };
}

async function listOwn(daytona, uid) {
  const sandboxes = [];
  for await (const sandbox of daytona.list({ labels: { [OWNER_LABEL]: uid } })) {
    sandboxes.push(sandbox);
  }
  return sandboxes;
}

export default async function handler(req, res) {
  if (!process.env.DAYTONA_API_KEY) {
    return res.status(501).json({
      success: false,
      error: 'NOT_CONFIGURED',
      message: 'Outpost gateway offline — set DAYTONA_API_KEY in Vercel env.'
    });
  }

  const uid = await verifyUser(req);
  if (!uid) {
    return res.status(401).json({ success: false, message: 'Sign-in required (invalid or missing session token).' });
  }

  const operatorUids = (process.env.OUTPOST_OPERATOR_UIDS || '')
    .split(',')
    .map((operatorUid) => operatorUid.trim())
    .filter(Boolean);
  if (process.env.OUTPOST_PRIVATE_MODE !== 'false' && !operatorUids.includes(uid)) {
    return res.status(403).json({
      success: false,
      error: 'PRIVATE_OPERATOR_ONLY',
      message: 'Hosted provisioning is private while the operator validates lifecycle and cost controls.',
      snapshotConfigured: Boolean(process.env.DAYTONA_SNAPSHOT),
      autoStopInterval: Number(process.env.OUTPOST_AUTO_STOP_MIN) || 15,
      autoDeleteInterval: Number(process.env.OUTPOST_AUTO_DELETE_MIN) || 120,
    });
  }

  const daytona = new Daytona({ apiKey: process.env.DAYTONA_API_KEY });

  try {
    if (req.method === 'GET') {
      const sandboxes = await listOwn(daytona, uid);
      return res.status(200).json({
        success: true,
        outposts: sandboxes.map(publicView),
        snapshotConfigured: Boolean(process.env.DAYTONA_SNAPSHOT),
        autoStopInterval: Number(process.env.OUTPOST_AUTO_STOP_MIN) || 15,
        autoDeleteInterval: Number(process.env.OUTPOST_AUTO_DELETE_MIN) || 120,
      });
    }

    if (req.method === 'POST') {
      if (!process.env.DAYTONA_SNAPSHOT) {
        return res.status(503).json({
          success: false,
          error: 'SNAPSHOT_REQUIRED',
          message: 'Hosted provisioning is in private validation. A registered Devin Outpost snapshot is required before launch.'
        });
      }

      const maxPerUser = Number(process.env.OUTPOST_MAX_PER_USER) || 2;
      const existing = await listOwn(daytona, uid);
      if (existing.length >= maxPerUser) {
        return res.status(429).json({
          success: false,
          error: 'CAP_REACHED',
          message: `Limit is ${maxPerUser} active outposts per user — stop one to launch another.`
        });
      }

      const { devinToken } = req.body || {};
      if (devinToken && (typeof devinToken !== 'string' || devinToken.length > 4000)) {
        return res.status(400).json({ success: false, message: 'Invalid outpost token.' });
      }

      const params = {
        labels: { [OWNER_LABEL]: uid },
        autoStopInterval: Number(process.env.OUTPOST_AUTO_STOP_MIN) || 15,
        autoDeleteInterval: Number(process.env.OUTPOST_AUTO_DELETE_MIN) || 120
      };
      if (process.env.DAYTONA_SNAPSHOT) params.snapshot = process.env.DAYTONA_SNAPSHOT;
      // Their token goes into their sandbox only — never logged, never stored.
      if (devinToken) params.envVars = { DEVIN_OUTPOST_TOKEN: devinToken };

      const sandbox = await daytona.create(params, { timeout: 50 });
      return res.status(200).json({ success: true, outpost: publicView(sandbox) });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || (req.body || {}).id;
      if (!id) return res.status(400).json({ success: false, message: 'Missing outpost id.' });

      const sandbox = await daytona.get(id);
      const owner = sandbox?.labels?.[OWNER_LABEL];
      if (owner !== uid) {
        return res.status(403).json({ success: false, message: 'Not your outpost.' });
      }
      await daytona.delete(sandbox);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'GET, POST, or DELETE only' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('MoltAgent Outposts provisioning failed', { method: req.method, message });
    return res.status(502).json({ success: false, message: `Daytona error: ${message}` });
  }
}
