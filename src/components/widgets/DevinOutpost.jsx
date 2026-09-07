import { useState, useEffect, useCallback } from 'react';
import {
  Cpu, Play, Square, RefreshCw, Zap, Radio, ExternalLink,
  Terminal, Activity, AlertTriangle, CheckCircle2, Hourglass, HelpCircle
} from 'lucide-react';

const POLL_INTERVAL = 5000;

export default function DevinOutpost({ setActiveAgents }) {
  const [activeTab, setActiveTab] = useState('dispatcher');
  const [status, setStatus] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [lastPoll, setLastPoll] = useState(null);

  const [prompt, setPrompt] = useState(
    'Audit this codebase, run the test suite, and open a PR with fixes'
  );
  const [repo, setRepo] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  const [terminating, setTerminating] = useState(null);

  const [log, setLog] = useState([]);
  const appendLog = useCallback((level, msg) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [...prev.slice(-199), { time, level, msg }]);
  }, []);

  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setIsPolling(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/devin-outposts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' }),
      });
      const data = await res.json();
      setStatus(data);
      setLastPoll(new Date());
    } catch (err) {
      setFetchError(err.message || 'Failed to reach the fleet API');
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
              type: 'Devin Session',
              task: prompt.slice(0, 30),
              load: 'init',
              color: '#7EB8C9',
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

  return (
    <div className="module">
      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">OPBETA FLEET API · DEVIN OUTPOSTS</div>
          <h2 className="masthead-title">Fleet control for your outpost</h2>
          <p className="masthead-sub">
            Dispatch sessions to your outpost queue. Workers claim them atomically via
            the fleet API at /opbeta/outposts/devins. You see every state transition.
          </p>
        </div>
        <div className="masthead-actions">
          <span className={`badge ${configured ? 'ok' : fetchError ? 'danger' : ''}`}>
            {configured ? 'Outpost connected' : fetchError ? 'API error' : 'Credentials needed'}
          </span>
          <button type="button" className="btn quiet" onClick={() => fetchStatus()} disabled={isPolling}>
            <RefreshCw size={13} className={isPolling ? 'spin' : ''} />
            {isPolling ? 'Polling' : 'Refresh'}
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="error-state">
          <div className="error-state-title">
            <AlertTriangle size={16} />
            Failed to reach the fleet API
          </div>
          <p className="error-state-desc">
            {fetchError}. This can happen if the /api/devin-outposts endpoint is not deployed
            or if environment variables are missing. In local development, run "vercel dev"
            to serve API routes.
          </p>
          <div className="error-state-action">
            <button type="button" className="btn" onClick={() => fetchStatus()}>
              <RefreshCw size={13} /> Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid cols-3" style={{ marginBottom: 'var(--sp-2)' }}>
        <div className="metric">
          <div className="metric-label">Claimed <Activity size={12} /></div>
          <div className="metric-value" style={{ color: claimedSessions.length > 0 ? 'var(--ice)' : 'var(--frost-2)' }}>
            {claimedSessions.length}
          </div>
          <div className="metric-sub">{claimedSessions.length > 0 ? 'Running on workers' : 'No active claims'}</div>
        </div>

        <div className="metric">
          <div className="metric-label">Pending <Hourglass size={12} /></div>
          <div className="metric-value">{pendingSessions.length}</div>
          <div className="metric-sub">Waiting for workers</div>
        </div>

        <div className="metric">
          <div className="metric-label">Total <Radio size={12} /></div>
          <div className="metric-value">{sessions.length}</div>
          <div className="metric-sub">{lastPoll ? `Polled ${lastPoll.toLocaleTimeString()}` : 'Not polled'}</div>
        </div>
      </div>

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

      {activeTab === 'dispatcher' && (
        <div className="grid cols-main-side">
          <div className="stack">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title"><Cpu size={15} />Dispatch Session</div>
                <span className="panel-note">Sessions queue on your outpost</span>
              </div>

              <label className="field-label" htmlFor="devin-prompt">Task prompt</label>
              <textarea
                id="devin-prompt"
                className="textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                disabled={!configured}
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
                disabled={!configured}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {configured
                    ? ['Fleet API', 'Self-hosted worker', status?.outpostName || 'Outpost'].map((t, i) => (
                        <span key={i} className="badge">{t}</span>
                      ))
                    : ['DEVIN_OUTPOSTS_TOKEN', 'OUTPOST_ID'].map((t, i) => (
                        <span key={i} className="badge danger">
                          <AlertTriangle size={10} /> {t} missing
                        </span>
                      ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <button type="button" className="btn primary" onClick={handleDispatch} disabled={isDispatching || !configured}>
                    {isDispatching ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
                    {isDispatching ? 'Dispatching' : 'Dispatch'}
                  </button>
                  <span className="btn-hint">
                    {configured ? 'Workers claim from the queue automatically' : 'Set environment variables first'}
                  </span>
                </div>
              </div>

              {dispatchResult && (
                <div className={`panel sunken`}
                  style={{ marginTop: 'var(--sp-3)', borderColor: dispatchResult.success ? 'var(--ice)' : 'var(--danger)' }}>
                  <div className="panel-head">
                    <span className={`badge ${dispatchResult.success ? 'ok' : 'danger'}`}>
                      {dispatchResult.success ? 'Dispatched' : 'Failed'}
                    </span>
                    {dispatchResult.sessionId && (
                      <span className="badge" style={{ fontFamily: 'var(--font-mono)' }}>{dispatchResult.sessionId}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: dispatchResult.success ? 'var(--ice)' : 'var(--danger)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    {dispatchResult.message || dispatchResult.error}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <div className="panel">
              <div className="panel-head"><span className="panel-title" style={{ fontSize: '0.75rem' }}>How This Works</span></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--frost-2)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                1. Sessions dispatch to your outpost queue<br />
                2. Workers poll the fleet API for pending sessions<br />
                3. A worker atomically claims the session<br />
                4. Execution runs on the worker's machine<br />
                5. Session completes or is terminated<br />
                6. Worker releases, ready for next session
              </div>
            </div>

            <div className="panel sunken">
              <div className="panel-head"><span className="panel-title" style={{ fontSize: '0.75rem' }}>Start a Worker</span></div>
              <pre className="codeblock" style={{ margin: 0, fontSize: '0.65rem', background: 'transparent', padding: 0 }}><code>{`devin worker start \\
  --outpost=<name> \\
  --token=<token>`}</code></pre>
              <p className="panel-sub" style={{ marginBottom: 0, marginTop: 'var(--sp-2)' }}>
                Install: curl -fsSL https://cli.devin.ai/install.sh | bash
              </p>
            </div>

            <a className="btn quiet" href="https://docs.devin.ai/cloud/outposts/quickstart" target="_blank" rel="noreferrer" style={{ justifyContent: 'flex-start' }}>
              <ExternalLink size={13} /> Outposts quickstart docs
            </a>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="stack">
          {!configured && !fetchError && (
            <div className="panel" style={{ borderColor: 'var(--amber)' }}>
              <div className="panel-head">
                <HelpCircle size={15} style={{ color: 'var(--amber)' }} />
                <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: '0.8rem' }}>Outpost not configured</span>
              </div>
              <div className="panel-sub" style={{ marginBottom: 'var(--sp-3)' }}>
                <p style={{ margin: 0 }}>To connect this control room to your Devin Outpost:</p>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--frost)' }}>1. Set environment variables in Vercel:</strong><br />
                <span style={{ color: 'var(--frost-3)', paddingLeft: '1em', display: 'block' }}>
                  DEVIN_OUTPOSTS_TOKEN = your v3 service token with ReadOutposts/WriteOutposts scope<br />
                  OUTPOST_ID = your outpost ID (outpost_env-...) or name
                </span>
                <br />
                <strong style={{ color: 'var(--frost)' }}>2. Start a worker on your machine:</strong><br />
                <span style={{ color: 'var(--frost-3)', paddingLeft: '1em', display: 'block' }}>
                  devin worker start --outpost=name --token=token
                </span>
                <br />
                <strong style={{ color: 'var(--frost)' }}>3. Refresh this page</strong><br />
              </div>
              <div style={{ marginTop: 'var(--sp-3)' }}>
                <a className="btn quiet" href="https://docs.devin.ai/cloud/outposts/quickstart" target="_blank" rel="noreferrer">
                  <ExternalLink size={13} /> Outposts documentation
                </a>
              </div>
            </div>
          )}

          {configured && sessions.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 size={32} />
              <div className="empty-state-title">Queue is empty</div>
              <p className="empty-state-desc">
                No sessions are queued on this outpost. Dispatch a session from the Dispatch tab
                to see it appear here. Workers will claim sessions automatically.
              </p>
              <div className="empty-state-action">
                <button type="button" className="btn" onClick={() => setActiveTab('dispatcher')}>
                  <Play size={13} /> Go to Dispatch
                </button>
              </div>
            </div>
          )}

          {configured && sessions.map((session) => {
            const badge = sessionStatusBadge(session.phase);
            return (
              <div key={session.sessionId} className="panel"
                style={session.phase === 'claimed' ? { borderColor: 'var(--ice)' } : undefined}>
                <div className="panel-head">
                  <span className={`badge ${badge.cls}`}>{badge.icon}<span style={{ marginLeft: '4px' }}>{badge.label}</span></span>
                  <span className="badge" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>{session.sessionId}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Queued: {session.createdAt ? new Date(session.createdAt * 1000).toLocaleString() : 'Unknown'}</div>
                  {session.acceptorId && <div>Worker: {session.acceptorId}</div>}
                </div>
                {(session.phase === 'claimed' || session.phase === 'pending') && (
                  <button type="button" className="btn danger" style={{ marginTop: 'var(--sp-2)', width: '100%' }}
                    onClick={() => handleTerminate(session.sessionId)} disabled={terminating === session.sessionId}>
                    {terminating === session.sessionId ? <RefreshCw size={13} className="spin" /> : <Square size={13} />}
                    {terminating === session.sessionId ? 'Terminating' : 'Terminate'}
                  </button>
                )}
              </div>
            );
          })}

          {configured && sessions.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--sp-2)', fontSize: '0.65rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', padding: 'var(--sp-2) 0' }}>
              <span><span style={{ color: 'var(--ice)' }}>●</span> {claimedSessions.length} claimed</span>
              <span><span style={{ color: 'var(--frost-2)' }}>○</span> {pendingSessions.length} pending</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'console' && (
        <div className="panel sunken">
          <div className="panel-head">
            <div className="panel-title"><Terminal size={15} />Event Log</div>
            <span className="panel-note">{log.length} entries</span>
          </div>
          <div className="console" style={{ maxHeight: '400px' }}>
            {log.length === 0 && (
              <div className="empty-state" style={{ padding: 'var(--sp-4)' }}>
                <Terminal size={24} />
                <div className="empty-state-title" style={{ fontSize: '0.85rem' }}>No events yet</div>
                <p className="empty-state-desc" style={{ fontSize: '0.72rem' }}>
                  Events appear here when you dispatch sessions, refresh status, or terminate sessions.
                </p>
              </div>
            )}
            {log.map((entry, i) => (
              <div key={i} className="log-row">
                <span className="log-time">[{entry.time}]</span>
                <span className="log-agent" style={{
                  color: entry.level === 'error' ? 'var(--danger)' :
                         entry.level === 'warn' ? 'var(--amber)' :
                         entry.level === 'ok' ? 'var(--ice)' : 'var(--frost-2)'
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
