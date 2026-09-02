import { useState, useEffect, useCallback } from 'react';
import { Rocket, RefreshCw, Trash2, Copy, Check, ExternalLink, KeyRound, BookOpen, ShieldCheck, TimerReset, Layers3, ScanLine } from 'lucide-react';
import { auth, signInAnonymously, onAuthStateChanged } from '../../firebase';

// S6 — Outpost Launcher. Two tiers:
//  Hosted: capped, auto-expiring Daytona sandboxes from Joe's org via
//          /api/outposts (Firebase session = identity; no Daytona account needed).
//  BYO:    pre-filled setup for people bringing their own Daytona + Devin org —
//          nothing touches this server at all.
// The launcher bootstraps its own anonymous session — App doesn't need to.
function PublicAccess({ autoStopInterval, autoDeleteInterval, onNavigate }) {
  return (
    <section className="public-access-panel" aria-label="Outposts access options">
      <div className="public-access-mark">
        <ShieldCheck size={18} />
        <span>HOSTED ACCESS · PRIVATE VALIDATION</span>
      </div>
      <h3>You can inspect the system. You can&rsquo;t spend its compute yet.</h3>
      <p>
        MoltAgent is proving the full lifecycle first: a clean snapshot, an isolated runtime,
        a visible ledger, and automatic cleanup. Hosted launches open only after that policy is
        ready for named trusted guests.
      </p>
      <dl className="public-access-policy">
        <div><dt><Layers3 size={15} /> Runtime</dt><dd>Clean registered snapshot</dd></div>
        <div><dt><TimerReset size={15} /> Lifecycle</dt><dd>{autoStopInterval} min idle stop · {autoDeleteInterval} min deletion</dd></div>
        <div><dt><KeyRound size={15} /> Access</dt><dd>Named invite required</dd></div>
      </dl>
      <div className="public-access-actions">
        <button type="button" className="btn primary" onClick={() => onNavigate?.('guide')}>
          <BookOpen size={14} /> Read the field guide
        </button>
        <a className="btn quiet" href="https://www.daytona.io/docs/en/guides/devin/devin-outposts/" target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> Run on your own Daytona
        </a>
      </div>
      <p className="public-access-note">Want trusted access when the invite lane opens? Follow the build and reply to the launch post. No API key or browser token is ever requested here.</p>
    </section>
  );
}

export default function NOESISBridge({ onNavigate }) {
  const [sessionUser, setSessionUser] = useState(null);
  const [outposts, setOutposts] = useState([]);
  const [gatewayState, setGatewayState] = useState('loading'); // loading | ready | offline | unauthed | private
  const [gatewayMessage, setGatewayMessage] = useState('');
  const [snapshotConfigured, setSnapshotConfigured] = useState(false);
  const [lifecycle, setLifecycle] = useState({ autoStopInterval: 15, autoDeleteInterval: 120 });
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
      if (status === 403) {
        setGatewayState('private');
        setSnapshotConfigured(Boolean(result.snapshotConfigured));
        setLifecycle({
          autoStopInterval: result.autoStopInterval || 15,
          autoDeleteInterval: result.autoDeleteInterval || 120,
        });
        setGatewayMessage(result.message || 'Hosted provisioning is private while the operator validates lifecycle and cost controls.');
        return;
      }
      if (result.success) {
        setGatewayState('ready');
        setOutposts(result.outposts);
        setSnapshotConfigured(Boolean(result.snapshotConfigured));
        setLifecycle({
          autoStopInterval: result.autoStopInterval || 15,
          autoDeleteInterval: result.autoDeleteInterval || 120,
        });
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

  const byoSnippet = `# Devin Outposts — first-party worker setup
# 1. Create an outpost in Devin Cloud: Settings -> Environment -> Outposts
# 2. Copy the outpost token (shown once at creation)
# 3. Install the Devin CLI and start the worker:

curl -fsSL https://cli.devin.ai/install.sh | bash

devin worker start --outpost=<outpost_name> --token=<your_token>

# The worker watches the queue and claims sessions automatically.
# Docs: https://docs.devin.ai/cloud/outposts/quickstart`;

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

  const launchReady = gatewayState === 'ready' && snapshotConfigured;
  const launchState = launchReady ? 'Ready to provision' : gatewayState === 'private' ? 'Private access required' : snapshotConfigured ? 'Control path unavailable' : 'Runtime image pending';

  return (
    <div className="module outpost-atelier">

      <div className="masthead atelier-masthead">
        <div>
          <div className="masthead-eyebrow">PRIVATE OPERATIONS · DAYTONA</div>
          <h2 className="masthead-title">A controlled place to put Devin to work.</h2>
          <p className="masthead-sub">
            Inspect every runtime before it exists: the snapshot it inherits, the boundary it obeys,
            and the policy that removes it. This is your private compute floor, not a public faucet.
          </p>
        </div>
        <div className={`atelier-state atelier-state-${launchReady ? 'ready' : 'locked'}`}>
          <span>PROVISIONING</span>
          <strong>{launchState}</strong>
          <small>{outposts.length} active runtime{outposts.length === 1 ? '' : 's'}</small>
        </div>
      </div>

      <section className="atelier-instrument" aria-label="Outpost launch boundary">
        <div className="atelier-instrument-copy">
          <span className="atelier-kicker">OUTPOST / 01</span>
          <h3>Every runtime leaves a receipt.</h3>
          <p>Snapshot, isolation boundary, idle stop, deletion horizon. The lifecycle is visible before you create compute.</p>
        </div>
        <dl className="atelier-policy-grid">
          <div><dt><Layers3 size={15} /> Runtime image</dt><dd>{snapshotConfigured ? 'Registered snapshot' : 'Not registered'}</dd></div>
          <div><dt><TimerReset size={15} /> Idle policy</dt><dd>{lifecycle.autoStopInterval} min stop · {lifecycle.autoDeleteInterval} min delete</dd></div>
          <div><dt><ShieldCheck size={15} /> Access boundary</dt><dd>Private session only</dd></div>
          <div><dt><ScanLine size={15} /> Fleet state</dt><dd>{gatewayState === 'ready' ? 'Gateway responding' : 'Awaiting control path'}</dd></div>
        </dl>
      </section>

      <div className="grid cols-main-side atelier-grid">

        <div className="stack">
          {gatewayState === 'private' ? (
            <PublicAccess
              autoStopInterval={lifecycle.autoStopInterval}
              autoDeleteInterval={lifecycle.autoDeleteInterval}
              onNavigate={onNavigate}
            />
          ) : (
            <>
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
          <div className="panel atelier-launch-panel">
            <div className="panel-head">
              <div className="panel-title">
                <Rocket size={15} />
                Prepare a private runtime
              </div>
              <span className="panel-note">{snapshotConfigured ? 'JoePro Daytona org · capped + auto-expiring' : 'Private validation · registered snapshot required'}</span>
            </div>

            <div className="atelier-launch-ledger" aria-label="Launch receipt preview">
              <span>OWNER</span><strong>JOEPRO AI</strong>
              <span>SNAPSHOT</span><strong>{snapshotConfigured ? 'REGISTERED' : 'PENDING'}</strong>
              <span>REMOVAL</span><strong>02:00 AFTER CREATION</strong>
            </div>

            <label className="field-label" htmlFor="devin-token">
              Devin Outpost token · optional
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
                {snapshotConfigured ? `Auto-stops after ${lifecycle.autoStopInterval} min idle · auto-deletes after ${lifecycle.autoDeleteInterval} min · 2 per user` : 'Launch stays locked until DAYTONA_SNAPSHOT is set'}
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
          <div className="panel sunken atelier-fleet-panel">
            <div className="panel-head">
              <div className="panel-title">Runtime ledger</div>
              <button type="button" className="btn quiet" onClick={refresh} disabled={gatewayState !== 'ready'}>
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            {outposts.length === 0 && (
              <p className="panel-sub" style={{ marginBottom: 0 }}>
                {gatewayState === 'ready'
                  ? 'No active runtimes. When you launch one, its full lifecycle receipt appears here.'
                  : 'The runtime ledger becomes available when the private control path responds.'}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {outposts.map((outpost) => (
                <div key={outpost.id} className="roster-row atelier-runtime-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="roster-name" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {outpost.id}
                    </div>
                    <div className="roster-role">
                      {outpost.snapshot ? `snapshot: ${outpost.snapshot}` : 'base image'} · idle stop {outpost.autoStopInterval}m · removal {outpost.autoDeleteInterval}m
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
            </>
          )}
        </div>

        {/* BYO tier */}
        <div className="stack">
          <div className="panel atelier-guest-panel">
            <div className="panel-head">
              <div className="panel-title">
                <KeyRound size={15} />
                Future guest lane
              </div>
              <span className="panel-note">Closed by policy</span>
            </div>
            <p className="panel-sub">
              Guest compute will be useful only when it is non-invasive: a dedicated minimal snapshot,
              named access, fixed lifecycle limits, and an immediate shutdown path. Until then, run
              your own worker and keep every credential in your environment.
            </p>

            <pre className="codeblock" style={{ maxHeight: '220px', fontSize: '0.66rem' }}><code>{byoSnippet}</code></pre>

            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button type="button" className="btn quiet" onClick={handleCopySnippet}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy scaffold'}
              </button>
              <a
                className="btn quiet"
                href="https://docs.devin.ai/cloud/outposts/quickstart"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                Quickstart guide
              </a>
              <a
                className="btn quiet"
                href="https://docs.devin.ai/cloud/outposts/overview#integrations"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                Partner platforms
              </a>
            </div>
          </div>

          <div className="panel sunken atelier-boundary-panel">
            <div className="panel-title" style={{ marginBottom: 'var(--sp-2)' }}>What stays true when guests arrive</div>
            <div className="atelier-boundary-list">
              <div><span>01</span><p>Access is named, revocable, and never anonymous-by-default.</p></div>
              <div><span>02</span><p>Each runtime starts clean with no JoePro workspace, memory, or credentials.</p></div>
              <div><span>03</span><p>Global limits and a single operator kill switch outrank convenience.</p></div>
              <div><span>04</span><p>Every compute session ends with a lifecycle receipt and automatic cleanup.</p></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
