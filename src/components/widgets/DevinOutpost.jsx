import { useState, useEffect, useCallback } from 'react';
import {
  Cpu, Play, Square, RefreshCw, Zap, Radio,
  Terminal, Activity, AlertTriangle, CheckCircle2, Hourglass
} from 'lucide-react';

// ---------------------------------------------------------------------------
// DevinOutpost — JoePro's Personal Super Executor Cockpit
// ---------------------------------------------------------------------------
// Talks to /api/devin-outposts (status, dispatch, terminate).
// Shows YOUR queue, YOUR sandboxes, YOUR credit runway.
// This is a personal dashboard — not a multi-tenant SaaS product.
// ---------------------------------------------------------------------------

const POLL_INTERVAL = 5000;

export default function DevinOutpost({ setActiveAgents }) {
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
        appendLog('ok', `Session ${data.sessionId} queued. A worker will claim it.`);
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
  const sessions = queue?.sessions || [];

  const claimedSessions = sessions.filter((s) => s.phase === 'claimed');
  const pendingSessions = sessions.filter((s) => s.phase === 'pending');

  const sessionStatusBadge = (phase) => {
    switch (phase) {
      case 'claimed':
        return { cls: 'ok', label: 'CLAIMED', icon: <Activity size={11} /> };
      case 'pending':
        return { cls: '', label: 'PENDING', icon: <Hourglass size={11} /> };
      default:
        return { cls: '', label: phase?.toUpperCase() || 'UNKNOWN', icon: null };
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="module">
      {/* Masthead */}
      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S7 · Devin Outpost Control</div>
          <h2 className="masthead-title">Your personal Devin cockpit</h2>
          <p className="masthead-sub">
            Every Devin session runs on workers you control. The queue is visible,
            workers claim sessions automatically, and you see the full lifecycle.
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
      <div className="grid cols-3" style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="metric">
          <div className="metric-label">Claimed <Activity size={12} /></div>
          <div className="metric-value" style={{ color: claimedSessions.length > 0 ? 'var(--ok)' : 'var(--frost-2)' }}>
            {claimedSessions.length}
          </div>
          <div className="metric-sub">{claimedSessions.length > 0 ? 'Sessions running on workers' : 'No claimed sessions'}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Pending <Hourglass size={12} /></div>
          <div className="metric-value">{pendingSessions.length}</div>
          <div className="metric-sub">Waiting for a worker</div>
        </div>

        <div className="metric">
          <div className="metric-label">Total in queue <Radio size={12} /></div>
          <div className="metric-value">{sessions.length}</div>
          <div className="metric-sub">{lastPoll ? `Last: ${lastPoll.toLocaleTimeString()}` : 'Not polled'}</div>
        </div>
      </div>

      {/* Tabset */}
      <div className="tabset" role="tablist" style={{ marginBottom: 'var(--sp-3)' }}>
        {[
          { id: 'dispatcher', label: 'DISPATCH', icon: <Play size={13} /> },
          { id: 'queue', label: 'QUEUE', icon: <Radio size={13} /> },
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
                <span className="panel-note">Queues on your outpost. Workers claim automatically.</span>
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
                    ? ['Devin Outposts', 'Self-hosted worker', 'Your infrastructure'].map((t, i) => (
                        <span key={i} className="badge">{t}</span>
                      ))
                    : ['Set DEVIN_OUTPOSTS_TOKEN', 'Set OUTPOST_ID'].map((t, i) => (
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
                    {configured ? 'Session queues until a worker claims it' : 'Configure credentials first'}
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

          {/* Info panel */}
          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <div className="panel">
              <div className="panel-head"><span className="panel-title" style={{ fontSize: '0.75rem' }}>How This Works</span></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--frost-2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                • Devin handles reasoning and the agent loop in the cloud<br />
                • Workers claim sessions and execute tool calls locally<br />
                • N workers serve N concurrent sessions<br />
                • Sessions wait in the queue until a worker is available<br />
                • All execution stays on your infrastructure<br />
                • Workers only need outbound HTTPS, no inbound ports
              </div>
            </div>

            <div className="panel sunken">
              <div className="panel-head"><span className="panel-title" style={{ fontSize: '0.75rem' }}>Start a Worker</span></div>
              <pre className="codeblock" style={{ margin: 0, fontSize: '0.65rem', background: 'transparent', padding: 0 }}><code>{`devin worker start \\
  --outpost=<name> \\
  --token=<token>`}</code></pre>
              <p className="panel-sub" style={{ marginBottom: 0, marginTop: 'var(--sp-2)' }}>
                Install with: curl -fsSL https://cli.devin.ai/install.sh | bash
              </p>
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
                Set DEVIN_OUTPOSTS_TOKEN and OUTPOST_ID in Vercel. Then start a worker
                with: devin worker start --outpost=&lt;name&gt;
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
            const badge = sessionStatusBadge(session.phase);
            return (
              <div key={session.sessionId} className="panel"
                style={session.phase === 'claimed' ? { borderColor: 'var(--ok)' } : undefined}>
                <div className="panel-head">
                  <span className={`badge ${badge.cls}`}>{badge.icon}<span style={{ marginLeft: '4px' }}>{badge.label}</span></span>
                  <span className="badge" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>{session.sessionId}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Queued: {session.createdAt ? new Date(session.createdAt * 1000).toLocaleString() : 'Unknown'}</div>
                  {session.acceptorId && <div>Worker: {session.acceptorId}</div>}
                </div>
                {(session.phase === 'claimed' || session.phase === 'pending') && (
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
              <span><span style={{ color: 'var(--ok)' }}>●</span> {claimedSessions.length} claimed</span>
              <span><span style={{ color: 'var(--frost-2)' }}>○</span> {pendingSessions.length} pending</span>
            </div>
          )}
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
