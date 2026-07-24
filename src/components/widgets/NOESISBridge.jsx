import React, { useState } from 'react';
import { Layers, Server, Shield, Zap, Loader, Terminal } from 'lucide-react';
import { db, doc, setDoc } from '../../firebase';

export default function NOESISBridge({ isSynced, setIsSynced, daytonaCredits, setDaytonaCredits, firebaseError }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(false);

  const handleSync = async () => {
    const newState = !isSynced;
    setIsSynced(newState);
    if (!firebaseError) {
      await setDoc(doc(db, 'system', 'core'), { isSynced: newState }, { merge: true }).catch(console.error);
    }
  };

  const handleWorkspace = async () => {
    if (activeWorkspace) {
      setActiveWorkspace(false);
      return;
    }
    
    setIsSpinning(true);
    
    if (firebaseError) {
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
        await setDoc(doc(db, 'system', 'core'), { daytonaCredits: newCredits }, { merge: true });
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsSpinning(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="widget-header">
        <h2 className="widget-title">
          <Layers size={20} color="#D4AF37" />
          HYBRID BRIDGE
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="agent-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Server size={20} color={isSynced ? "#D4AF37" : "var(--text-muted)"} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em' }}>LOCAL NOESIS</h4>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>RTX 5080 • Bidirectional</div>
            </div>
          </div>
          <button 
            className={`glass-button ${isSynced ? 'primary' : ''}`} 
            style={{ padding: '8px 16px' }}
            onClick={handleSync}
          >
            {isSynced ? 'SYNCED' : 'SYNC DB'}
          </button>
        </div>

        <div className="agent-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Zap size={20} color="var(--text-muted)" />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em' }}>OPENCLAW</h4>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Agents imported: 4</div>
            </div>
          </div>
          <button className="glass-button" style={{ padding: '8px 16px' }}>UPGRADE</button>
        </div>

        <div className="agent-card" style={{ borderBottomColor: activeWorkspace ? '#D4AF37' : 'var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Shield size={20} color={activeWorkspace ? "#D4AF37" : "var(--text-muted)"} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em' }}>DAYTONA.IO</h4>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {activeWorkspace ? 'Workspace Active • AETHER Build' : `Dev Environments • $${daytonaCredits.toLocaleString()}`}
              </div>
            </div>
          </div>
          <button 
            className={`glass-button ${activeWorkspace ? 'primary' : ''}`} 
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleWorkspace}
            disabled={isSpinning}
          >
            {isSpinning ? <Loader size={14} className="floating" /> : activeWorkspace ? <><Terminal size={14} /> ACTIVE</> : 'START BUILD'}
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '32px', padding: '20px', border: '1px solid var(--border-glass)', background: 'transparent' }}>
        <h4 style={{ margin: 0, marginBottom: '12px', fontSize: '0.8rem', fontWeight: '500', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>ROUTING INTEL</h4>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', lineHeight: '1.6' }}>
          "Defy Gravity" mode active. Heavy rendering routed to Google Cloud. Daytona workspaces handle active dev builds. Cinematic polish pulled back to local NOESIS.
        </p>
      </div>
    </div>
  );
}
