import { useState, useEffect, useCallback } from 'react';
import {
  Cpu, Play, Square, RefreshCw, Zap, Radio, Server,
  Clock, Terminal, Activity, AlertTriangle, CheckCircle2,
  Hourglass, DollarSign, HardDrive
} from 'lucide-react';

// ---------------------------------------------------------------------------
// DevinOutpost — JoePro's Personal Super Executor Cockpit
// ---------------------------------------------------------------------------
// Talks to /api/devin-outposts (status, dispatch, terminate).
// Shows YOUR queue, YOUR sandboxes, YOUR credit runway.
// This is a personal dashboard — not a multi-tenant SaaS product.
// ---------------------------------------------------------------------------

const POLL_INTERVAL = 5000;

export default function DevinOutpost({ daytonaCredits, setActiveAgents }) {
  const [activeTab, setActiveTab] = useState('dispatcher');
  const [status, setStatus] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [lastPoll, setLastPoll] = useState(null);

  // Dispatch
  const [prompt, setPrompt] = useState(
    'Audit this codebase, run the test suite, and open a PR with fixes'
  );
  const [repo, setRepo] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  // Terminate
  const [terminating, setTerminating] = useState(null);

  // Log
  const [log, setLog] = useState([]);
  const appendLog = useCallback((level, msg) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [...prev.slice(-199), { time, level, msg }]);
  }, []);

  // ── Polling ──────────────────────────────────────────────────────
  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setIsPolling(true);
    try {
      const res = await fetch('/api/devin-outposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' }),
      });
      const data = await res.json();
      setStatus(data);
      setLastPoll(new Date());
    } catch (_e) {
      void _e;
      // orchestrator not running — that's fine during demos
    } finally {
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    fetchStatus();
    const interval = setInterval(() => fetchStatus(true), POLL_INTERVAL);
    return () => clearInterval(interval);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchStatus]);

  // ── Dispatch ─────────────────────────────────────────────────────
  const handleDispatch = async () => {
    if (isDispatching) return;
    setIsDispatching(true);
    setDispatchResult(null);
    appendLog('info', `Dispatch: "${prompt.slice(0, 80)}..."`);

    try {
      const res = await fetch('/api/devin-outposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispatch', prompt, repo: repo || undefined }),
      });
      const data = await res.json();
      setDispatchResult(data);

      if (data.success) {
        appendLog('ok', `Session ${data.sessionId} queued on outpost.`);
        if (setActiveAgents) {
          setActiveAgents((prev) => [
            ...prev,
            {
              id: `devin-${data.sessionId?.slice(-6) || Date.now().toString(36)}`,
              swarmId: 'devin',
              type: 'Devin Super Executor',
              task: prompt.slice(0, 30),
              load: 'init',
              color: '#63E6BE',
              position: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
              scale: 0.4,
              speed: 0.12,
              speedOffset: Math.random() * Math.PI * 2,
            },
          ]);
        }
        setTimeout(() => fetchStatus(true), 1500);
      } else {
        appendLog('error', `Dispatch failed: ${data.error}`);
      }
    } catch (err) {
      setDispatchResult({ success: false, error: err.message });
      appendLog('error', `Dispatch error: ${err.message}`);
    } finally {
      setIsDispatching(false);
    }
  };

  // ── Terminate ────────────────────────────────────────────────────
  const handleTerminate = async (sessionId) => {
    setTerminating(sessionId);
    appendLog('info', `Terminating ${sessionId}...`);
    try {
      const res = await fetch('/api/devin-outposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'terminate', sessionId }),
      });
      const data = await res.json();
      if (data.success) appendLog('ok', `Session ${sessionId} terminated.`);
      else appendLog('error', `Terminate failed: ${data.error}`);
      fetchStatus(true);
    } catch (err) {
      appendLog('error', `Terminate error: ${err.message}`);
    } finally {
      setTerminating(null);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────
  const configured = status?.configured;
  const queue = status?.queue;
  const sandboxes = status?.sandboxes || [];
  const sessions = queue?.sessions || [];

  const claimedSessions = sessions.filter((s) => s.status === 'claimed');
  const waitingSessions = sessions.filter((s) => s.status === 'waiting');
  const sleepingSessions = sessions.filter((s) => s.status === 'sleeping');

  // Real Daytona pricing: ~$0.23/hr active (2 vCPU + 8 GiB), $0 sleeping
  const activeHourlyRate = 0.23;
  const creditToDollar = 0.0125; // conservative: ~$200 free tier = ~16K credits
  const dollarBalance = daytonaCredits * creditToDollar;
  const activeHours = dollarBalance / activeHourlyRate;
  const typicalDailyHours = 4;
  const typicalDays = activeHours / typicalDailyHours;

  const sessionStatusBadge = (s) => {
    switch (s) {
      case 'claimed':
        return { cls: 'ok', label: 'RUNNING', icon: <Activity size={11} /> };
      case 'waiting':
        return { cls: '', label: 'QUEUED', icon: <Hourglass size={11} /> };
      case 'sleeping':
        return { cls: '', label: 'SLEEPING', icon: <Clock size={11} /> };
      default:
        return { cls: '', label: s?.toUpperCase(), icon: null };
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="module">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S7 · Devin Outpost Super Executor</div>
          <h2 className="masthead-title">Your personal Devin cockpit — Daytona-powered</h2>
          <p className="masthead-sub">
            Every Devin session runs in an isolated Daytona sandbox on your infrastructure.
            Sessions sleep for free, wake with state intact, and delete when done.
            ~$0.23/hr active. $0/hr sleeping.
          </p>
        </div>
        <div className="masthead-actions">
          <span className={`badge ${configured ? 'ok' : ''}`}>
            {configured ? 'Outpost connected' : 'Credentials needed'}
          </span>
          <button type="button" className="btn quiet" onClick={() => fetchStatus()} disabled={isPolling}>
            <RefreshCw size={13} className={isPolling ? 'spin' : ''} />
            {isPolling ? 'Polling…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid cols-4" style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="metric">
          <div className="metric-label">Active sessions <Activity size={12} /></div>
          <div className="metric-value" style={{ color: claimedSessions.length > 0 ? 'var(--ok)' : 'var(--frost-2)' }}>
            {claimedSessions.length}
          </div>
          <div className="metric-sub">{claimedSessions.length > 0 ? 'Daytona sandboxes live' : 'No active sandboxes'}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Queued <Hourglass size={12} /></div>
          <div className="metric-value">{waitingSessions.length}</div>
          <div className="metric-sub">Waiting for a free slot</div>
        </div>

        <div className="metric">
          <div className="metric-label">Est. runway <DollarSign size={12} /></div>
          <div className="metric-value" style={{ color: typicalDays > 180 ? 'var(--ok)' : 'var(--amber)' }}>
            {Math.round(typicalDays)} days
          </div>
          <div className="metric-sub">At {typicalDailyHours}h active/day</div>
        </div>

        <div className="metric">
          <div className="metric-label">Sandboxes <Server size={12} /></div>
          <div className="metric-value">{sandboxes.length}</div>
          <div className="metric-sub">{lastPoll ? `Last: ${lastPoll.toLocaleTimeString()}` : 'Not polled'}</div>
        </div>
      </div>

      {/* Tabset */}
      <div className="tabset" role="tablist" style={{ marginBottom: 'var(--sp-3)' }}>
        {[
          { id: 'dispatcher', label: 'DISPATCH', icon: <Play size={13} /> },
          { id: 'queue', label: 'QUEUE', icon: <Radio size={13} /> },
          { id: 'sandboxes', label: 'SANDBOXES', icon: <HardDrive size={13} /> },
          { id: 'console', label: 'LOG', icon: <Terminal size={13} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Dispatcher */}
      {activeTab === 'dispatcher' && (
        <div className="grid cols-main-side">
          <div className="stack">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><Cpu size={15} />Dispatch Devin</div>
                <span className="panel-note">Runs on your Daytona sandbox. $0.23/hr active.</span>
              </div>

              <label className="field-label" htmlFor="devin-prompt">What should Devin work on?</label>
              <textarea
                id="devin-prompt"
                className="textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />

              <label className="field-label" htmlFor="devin-repo" style={{ marginTop: 'var(--sp-3)' }}>
                Repository (optional)
              </label>
              <input
                id="devin-repo"
                type="text"
                className="field"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="https://github.com/user/repo"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {configured
                    ? ['Devin Enterprise', 'Daytona sandbox', '~$0.23/hr active'].map((t, i) => (
                        <span key={i} className="badge">{t}</span>
                      ))
                    : ['Set DEVIN_OUTPOSTS_TOKEN', 'Set DAYTONA_API_KEY', 'Set OUTPOST_ID'].map((t, i) => (
                        <span key={i} className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                          <AlertTriangle size={10} style={{ marginRight: '4px' }} />{t}
                        </span>
                      ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <button type="button" className="btn primary" onClick={handleDispatch} disabled={isDispatching || !configured}>
                    {isDispatching ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
                    {isDispatching ? 'Dispatching…' : 'Dispatch'}
                  </button>
                  <span className="btn-hint">
                    {configured ? 'Session lands in your Daytona sandbox' : 'Configure credentials first'}
                  </span>
                </div>
              </div>

              {dispatchResult && (
                <div className={`panel sunken ${dispatchResult.success ? '' : ''}`}
                  style={{ marginTop: 'var(--sp-3)', borderColor: dispatchResult.success ? 'var(--ok)' : 'var(--danger)' }}>
                  <div className="panel-head">
                    <span className={`badge ${dispatchResult.success ? 'ok' : 'hot'}`}>
                      {dispatchResult.success ? 'Dispatched' : 'Failed'}
                    </span>
                    {dispatchResult.sessionId && (
                      <span className="badge" style={{ fontFamily: 'var(--font-mono)' }}>{dispatchResult.sessionId}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: dispatchResult.success ? 'var(--ok)' : 'var(--danger)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    {dispatchResult.message || dispatchResult.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Runway panel */}
          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <span className="field-label">Credit Runway</span>
            <div className="panel">
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>
                ~{Math.round(typicalDays)} days
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                at {typicalDailyHours}h active per day · ~${activeHourlyRate.toFixed(2)}/hr active
              </div>
              <div className="segmeter running" aria-hidden="true" style={{ marginTop: 'var(--sp-3)' }}>
                {[...Array(10)].map((_, i) => (
                  <span key={i} className={i < Math.min(10, Math.ceil((typicalDays / 365) * 10)) ? 'lit' : ''} />
                ))}
              </div>
              <p className="panel-sub" style={{ marginBottom: 0, marginTop: 'var(--sp-2)' }}>
                {typicalDays > 180
                  ? `$${dollarBalance.toFixed(0)} balance. Sessions sleep free — real runway much longer.`
                  : `$${dollarBalance.toFixed(0)} balance. Sessions only cost when actively coding.`}
              </p>
            </div>

            <div className="panel">
              <div className="panel-head"><span className="panel-title" style={{ fontSize: '0.75rem' }}>How This Works</span></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--frost-2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                • Your Devin session runs inside a Daytona sandbox<br />
                • ~$0.23/hr when Devin is actively coding<br />
                • $0/hr when the session sleeps (filesystem preserved)<br />
                • Sandbox deleted when session ends<br />
                • All execution stays on your infrastructure<br />
                • Carapace firewall gates memory between cloud and local
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Queue */}
      {activeTab === 'queue' && (
        <div className="stack">
          {!configured && (
            <div className="panel" style={{ borderColor: 'var(--danger)' }}>
              <div className="panel-head">
                <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
                <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.8rem' }}>Not configured</span>
              </div>
              <p className="panel-sub" style={{ marginBottom: 0 }}>
                Set DEVIN_OUTPOSTS_TOKEN, DAYTONA_API_KEY, and OUTPOST_ID in Vercel.
                Then start the Daytona orchestrator with: devin-outposts-orchestrator
              </p>
            </div>
          )}

          {configured && sessions.length === 0 && (
            <div className="panel sunken">
              <div className="panel-head">
                <CheckCircle2 size={15} style={{ color: 'var(--ok)' }} />
                <span style={{ color: 'var(--ok)', fontWeight: 700 }}>Queue empty</span>
              </div>
              <p className="panel-sub" style={{ marginBottom: 0 }}>No sessions queued. Dispatch one.</p>
            </div>
          )}

          {configured && sessions.map((session) => {
            const badge = sessionStatusBadge(session.status);
            return (
              <div key={session.sessionId} className="panel"
                style={session.status === 'claimed' ? { borderColor: 'var(--ok)' } : undefined}>
                <div className="panel-head">
                  <span className={`badge ${badge.cls}`}>{badge.icon}<span style={{ marginLeft: '4px' }}>{badge.label}</span></span>
                  <span className="badge" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>{session.sessionId}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Queued: {new Date(session.queuedAt).toLocaleString()}</div>
                  {session.claimedAt && <div>Claimed: {new Date(session.claimedAt).toLocaleString()}</div>}
                </div>
                {(session.status === 'claimed' || session.status === 'waiting') && (
                  <button type="button" className="btn" style={{ marginTop: 'var(--sp-2)', width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                    onClick={() => handleTerminate(session.sessionId)} disabled={terminating === session.sessionId}>
                    {terminating === session.sessionId ? <RefreshCw size={13} className="spin" /> : <Square size={13} />}
                    {terminating === session.sessionId ? 'Terminating…' : 'Terminate'}
                  </button>
                )}
              </div>
            );
          })}

          {configured && sessions.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--sp-2)', fontSize: '0.65rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', padding: 'var(--sp-2) 0' }}>
              <span><span style={{ color: 'var(--ok)' }}>●</span> {claimedSessions.length} running</span>
              <span><span style={{ color: 'var(--frost-2)' }}>○</span> {waitingSessions.length} waiting</span>
              <span><span style={{ color: 'var(--frost-1)' }}>◎</span> {sleepingSessions.length} sleeping</span>
            </div>
          )}
        </div>
      )}

      {/* TAB: Sandboxes */}
      {activeTab === 'sandboxes' && (
        <div className="stack">
          {sandboxes.length === 0 && (
            <div className="panel sunken">
              <div className="panel-head"><Server size={15} /><span style={{ fontWeight: 700, fontSize: '0.8rem' }}>No active sandboxes</span></div>
              <p className="panel-sub" style={{ marginBottom: 0 }}>
                {configured ? 'No Devin sessions running right now.' : 'Configure the outpost to see sandboxes.'}
              </p>
            </div>
          )}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {sandboxes.map((box) => (
              <div key={box.id} className="panel" style={{ borderColor: box.state === 'started' ? 'var(--ok)' : 'var(--seam)' }}>
                <div className="panel-head">
                  <span className="panel-title" style={{ fontSize: '0.75rem' }}>{box.name}</span>
                  <span className={`badge ${box.state === 'started' ? 'ok' : ''}`}>{box.state?.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>ID: {box.id}</div>
                  <div>Created: {new Date(box.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Console */}
      {activeTab === 'console' && (
        <div className="panel sunken">
          <div className="panel-head">
            <div className="panel-title"><Terminal size={15} />Event Log</div>
            <span className="panel-note">{log.length} entries · polls every {POLL_INTERVAL / 1000}s</span>
          </div>
          <div className="console" style={{ maxHeight: '400px' }}>
            {log.length === 0 && (
              <div style={{ color: 'var(--frost-2)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                No events yet. Dispatch a session to see activity here.
              </div>
            )}
            {log.map((entry, i) => (
              <div key={i} className="log-row">
                <span className="log-time">[{entry.time}]</span>
                <span className="log-agent" style={{
                  color: entry.level === 'error' ? 'var(--danger)' :
                         entry.level === 'warn' ? 'var(--amber)' :
                         entry.level === 'ok' ? 'var(--ok)' : 'var(--frost-2)'
                }}>{entry.level.toUpperCase()}</span>
                <span className="log-msg">{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
