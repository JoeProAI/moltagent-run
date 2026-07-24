import { useState } from 'react';
import { Server, Shield, Zap, Loader, Terminal } from 'lucide-react';
import { db, doc, setDoc } from '../../firebase';

export default function NOESISBridge({ isSynced, setIsSynced, daytonaCredits, setDaytonaCredits, cloudSync, sessionId }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(false);

  const handleSync = async () => {
    const newState = !isSynced;
    setIsSynced(newState);
    if (cloudSync) {
      await setDoc(doc(db, 'userState', sessionId), { isSynced: newState, owner: sessionId }, { merge: true }).catch(console.error);
    }
  };

  const handleWorkspace = async () => {
    if (activeWorkspace) {
      setActiveWorkspace(false);
      return;
    }

    setIsSpinning(true);

    if (!cloudSync) {
      setTimeout(() => {
        setIsSpinning(false);
        setActiveWorkspace(true);
        setDaytonaCredits(prev => Math.max(0, prev - 120));
      }, 2000);
      return;
    }

    try {
      setTimeout(async () => {
        setIsSpinning(false);
        setActiveWorkspace(true);
        const newCredits = Math.max(0, daytonaCredits - 120);
        setDaytonaCredits(newCredits);
        await setDoc(doc(db, 'userState', sessionId), { daytonaCredits: newCredits, owner: sessionId }, { merge: true });
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsSpinning(false);
    }
  };

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S6 · Hybrid bridge</div>
          <h2 className="masthead-title">Route work between your RTX 5080 and the cloud</h2>
          <p className="masthead-sub">
            Heavy rendering goes to Google Cloud, dev builds go to Daytona workspaces, and
            cinematic polish comes back to local NOESIS on your own GPU.
          </p>
        </div>
        <div className="masthead-actions">
          <span className={`badge ${isSynced ? 'ok' : ''}`}>{isSynced ? 'NOESIS synced' : 'NOESIS not synced'}</span>
        </div>
      </div>

      <div className="grid cols-3">

        <div className="panel" style={isSynced ? { borderColor: 'var(--amber)' } : undefined}>
          <div className="panel-head">
            <div className="panel-title">
              <Server size={15} />
              Local NOESIS
            </div>
            <span className={`badge ${isSynced ? 'ok' : ''}`}>{isSynced ? 'Synced' : 'Offline'}</span>
          </div>
          <p className="panel-sub">
            Bidirectional memory sync between this workbench and the NOESIS engine on your RTX 5080.
          </p>
          <button
            type="button"
            className={`btn ${isSynced ? '' : 'primary'}`}
            style={{ width: '100%' }}
            onClick={handleSync}
          >
            {isSynced ? 'Disconnect sync' : 'Sync with local GPU'}
          </button>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <Zap size={15} />
              OpenClaw
            </div>
            <span className="badge">4 agents imported</span>
          </div>
          <p className="panel-sub">
            Import agents from your OpenClaw platform and run them inside the MoltAgent swarm.
          </p>
          <button type="button" className="btn" style={{ width: '100%' }}>
            Import more agents
          </button>
        </div>

        <div className="panel" style={activeWorkspace ? { borderColor: 'var(--amber)' } : undefined}>
          <div className="panel-head">
            <div className="panel-title">
              <Shield size={15} />
              Daytona.io
            </div>
            <span className={`badge ${activeWorkspace ? 'hot' : ''}`}>
              {activeWorkspace ? 'Workspace active' : `${daytonaCredits.toLocaleString()} credits`}
            </span>
          </div>
          <p className="panel-sub">
            {activeWorkspace
              ? 'AETHER build running in a cloud dev workspace. Costs 120 credits per build.'
              : 'Spin up a cloud dev workspace for the next build. Costs 120 credits per build.'}
          </p>
          <button
            type="button"
            className={`btn ${activeWorkspace ? '' : 'primary'}`}
            style={{ width: '100%' }}
            onClick={handleWorkspace}
            disabled={isSpinning}
          >
            {isSpinning ? <Loader size={14} className="spin" /> : activeWorkspace ? <Terminal size={14} /> : null}
            {isSpinning ? 'Starting workspace…' : activeWorkspace ? 'Stop workspace' : 'Start cloud build'}
          </button>
        </div>

      </div>

      <div className="panel sunken">
        <div className="panel-head">
          <div className="panel-title">Routing intel</div>
          <span className="panel-note">Defy Gravity mode active</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', lineHeight: 1.7, margin: 0 }}>
          Heavy rendering routed to Google Cloud. Daytona workspaces handle active dev builds.
          Cinematic polish pulled back to local NOESIS.
        </p>
      </div>

    </div>
  );
}
