import { useState, useEffect, useCallback } from 'react';
import { Rocket, RefreshCw, Trash2, Copy, Check, ExternalLink, KeyRound, BookOpen } from 'lucide-react';
import { auth, signInAnonymously, onAuthStateChanged } from '../../firebase';

// S6 — Outpost Launcher. Two tiers:
//  Hosted: capped, auto-expiring Daytona sandboxes from Joe's org via
//          /api/outposts (Firebase session = identity; no Daytona account needed).
//  BYO:    pre-filled setup for people bringing their own Daytona + Devin org —
//          nothing touches this server at all.
// The launcher bootstraps its own anonymous session — App doesn't need to.
export default function NOESISBridge({ onNavigate }) {
  const [sessionUser, setSessionUser] = useState(null);
  const [outposts, setOutposts] = useState([]);
  const [gatewayState, setGatewayState] = useState('loading'); // loading | ready | offline | unauthed
  const [gatewayMessage, setGatewayMessage] = useState('');
  const [snapshotConfigured, setSnapshotConfigured] = useState(false);
  const [devinToken, setDevinToken] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setSessionUser(user));
    signInAnonymously(auth).catch(() => {
      setGatewayState('unauthed');
      setGatewayMessage('Anonymous sessions are disabled on this Firebase project.');
    });
    return unsub;
  }, []);

  const authedFetch = useCallback(async (method, body, queryString = '') => {
    const user = auth.currentUser;
    if (!user) throw Object.assign(new Error('No session'), { code: 'NO_SESSION' });
    const idToken = await user.getIdToken();
    const response = await fetch(`/api/outposts${queryString}`, {
      method,
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const result = await response.json().catch(() => ({}));
    return { status: response.status, result };
  }, []);

  const refresh = useCallback(async () => {
    if (!sessionUser) return;
    try {
      const { status, result } = await authedFetch('GET');
      if (status === 501) {
        setGatewayState('offline');
        setGatewayMessage(result.message || 'Gateway not configured yet.');
        return;
      }
      if (status === 401) {
        setGatewayState('unauthed');
        setGatewayMessage('Session expired — reload the page.');
        return;
      }
      if (result.success) {
        setGatewayState('ready');
        setOutposts(result.outposts);
        setSnapshotConfigured(Boolean(result.snapshotConfigured));
      }
    } catch {
      setGatewayState('offline');
      setGatewayMessage('Gateway unreachable. In local dev, /api routes need "vercel dev".');
    }
  }, [sessionUser, authedFetch]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- async fetch state, not sync set */
    refresh();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [refresh]);

  const handleLaunch = async () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setGatewayMessage('');
    try {
      const body = devinToken.trim() ? { devinToken: devinToken.trim() } : {};
      const { status, result } = await authedFetch('POST', body);
      if (result.success) {
        setDevinToken('');
        await refresh();
      } else {
        setGatewayMessage(result.message || `Launch failed (${status}).`);
      }
    } catch (err) {
      setGatewayMessage(`Launch failed: ${err.message}`);
    }
    setIsLaunching(false);
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await authedFetch('DELETE', null, `?id=${encodeURIComponent(id)}`);
      await refresh();
    } catch (err) {
      setGatewayMessage(`Delete failed: ${err.message}`);
    }
    setBusyId(null);
  };

  const byoSnippet = `# Devin Outposts on your own Daytona org — official flow
# 1. Daytona key:   app.daytona.io -> API Keys (scope: sandbox create)
# 2. Outpost token: Devin settings -> Outposts (requires Devin Enterprise)
export DAYTONA_API_KEY="dtn_your_key_here"
export DEVIN_OUTPOST_TOKEN="your_outpost_token_here"

# Then follow the official guide (snapshot + registration):
# https://www.daytona.io/docs/en/guides/devin/devin-outposts/`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(byoSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stateBadge = (state) => {
    const s = (state || '').toLowerCase();
    if (s === 'started' || s === 'running') return <span className="badge ok">{state}</span>;
    if (s === 'error' || s === 'destroyed') return <span className="badge danger">{state}</span>;
    return <span className="badge">{state || 'pending'}</span>;
  };

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S6 · Outpost launcher</div>
          <h2 className="masthead-title">Spin up a Devin outpost sandbox in one click</h2>
          <p className="masthead-sub">
            Hosted Daytona sandboxes, no Daytona account needed — capped per user, auto-stopped
            when idle, auto-deleted after two hours. Bring your own Devin outpost token and the
            sandbox registers into your org; the token is used once and never stored.
          </p>
        </div>
        <div className="masthead-actions">
          {gatewayState === 'ready' && <span className="badge ok">Gateway online</span>}
          {gatewayState === 'offline' && <span className="badge">Gateway offline</span>}
          {gatewayState === 'unauthed' && <span className="badge">Session required</span>}
        </div>
      </div>

      <div className="grid cols-main-side">

        <div className="stack">
          {!snapshotConfigured && gatewayState === 'ready' && (
            <div className="guide-callout">
              <KeyRound size={18} />
              <div>
                <strong>Snapshot required before hosted launch.</strong>
                <span> Build and register a Devin Outpost snapshot first. The guide has the exact runbook.</span>
              </div>
              <button type="button" className="btn quiet" onClick={() => onNavigate?.('guide')}>
                <BookOpen size={14} /> Open guide
              </button>
            </div>
          )}

          {/* Hosted launcher */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Rocket size={15} />
                Launch a hosted sandbox
              </div>
              <span className="panel-note">{snapshotConfigured ? 'Runs on @JoePro’s Daytona org · capped + auto-expiring' : 'Private validation · registered snapshot required'}</span>
            </div>

            <label className="field-label" htmlFor="devin-token">
              Devin outpost token — optional, routes the outpost into your org
            </label>
            <input
              id="devin-token"
              type="password"
              className="field"
              placeholder={snapshotConfigured ? 'Paste your Cognition outpost token (kept in memory, never stored)' : 'Complete the snapshot runbook first'}
              value={devinToken}
              onChange={(e) => setDevinToken(e.target.value)}
              disabled={gatewayState !== 'ready' || !snapshotConfigured}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <span className="btn-hint" style={{ textAlign: 'left' }}>
                {snapshotConfigured ? 'Auto-stops after 15 min idle · auto-deletes after 2 h · 2 per user' : 'Launch stays locked until DAYTONA_SNAPSHOT is set'}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleLaunch}
                  disabled={isLaunching || gatewayState !== 'ready' || !snapshotConfigured}
                >
                  {isLaunching ? <RefreshCw size={14} className="spin" /> : <Rocket size={14} />}
                  {isLaunching ? 'Provisioning…' : snapshotConfigured ? 'Launch outpost sandbox' : 'Snapshot required'}
                </button>
                <span className="btn-hint">Creates a real Daytona sandbox for your session</span>
              </div>
            </div>

            {gatewayMessage && (
              <p style={{ marginTop: 'var(--sp-3)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: gatewayState === 'ready' ? 'var(--danger)' : 'var(--frost-2)' }}>
                {gatewayMessage}
              </p>
            )}
          </div>

          {/* Fleet */}
          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">Your outposts</div>
              <button type="button" className="btn quiet" onClick={refresh} disabled={gatewayState !== 'ready'}>
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            {outposts.length === 0 && (
              <p className="panel-sub" style={{ marginBottom: 0 }}>
                {gatewayState === 'ready'
                  ? 'No active outposts. Launch one above — it appears here with live state.'
                  : 'The fleet list appears once the gateway is online.'}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {outposts.map((outpost) => (
                <div key={outpost.id} className="roster-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="roster-name" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {outpost.id}
                    </div>
                    <div className="roster-role">
                      {outpost.snapshot ? `snapshot: ${outpost.snapshot}` : 'base image'} · stops after {outpost.autoStopInterval}m idle
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}>
                    {stateBadge(outpost.state)}
                    <button
                      type="button"
                      className="btn quiet"
                      aria-label={`Delete outpost ${outpost.id}`}
                      onClick={() => handleDelete(outpost.id)}
                      disabled={busyId === outpost.id}
                    >
                      {busyId === outpost.id ? <RefreshCw size={14} className="spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BYO tier */}
        <div className="stack">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <KeyRound size={15} />
                Bring your own org
              </div>
            </div>
            <p className="panel-sub">
              Fully non-invasive: your Daytona org, your Devin Enterprise outpost token, nothing
              touches this site. Copy the scaffold, fill your keys locally, follow the official guide.
            </p>

            <pre className="codeblock" style={{ maxHeight: '220px', fontSize: '0.66rem' }}><code>{byoSnippet}</code></pre>

            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button type="button" className="btn quiet" onClick={handleCopySnippet}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy scaffold'}
              </button>
              <a
                className="btn quiet"
                href="https://www.daytona.io/docs/en/guides/devin/devin-outposts/"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                Daytona guide
              </a>
              <a
                className="btn quiet"
                href="https://docs.devin.ai/cloud/outposts/overview"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                Devin outposts docs
              </a>
            </div>
          </div>

          <div className="panel sunken">
            <div className="panel-title" style={{ marginBottom: 'var(--sp-2)' }}>How the hosted tier works</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--frost-2)', lineHeight: 1.8 }}>
              <div>1. Your session signs the request — no Daytona key on your side</div>
              <div>2. Gateway creates a labeled sandbox in Joe's org</div>
              <div>3. Your outpost token (if given) is injected once, never stored</div>
              <div>4. Idle sandboxes stop themselves; all delete within 2 h</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
