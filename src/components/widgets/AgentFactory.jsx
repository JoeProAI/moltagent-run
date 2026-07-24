import React, { useState, useEffect } from 'react';
import { Play, Zap, Loader } from 'lucide-react';
import { db, doc, setDoc, deleteDoc, collection, getDocs, writeBatch } from '../../firebase';

export default function AgentFactory({ activeAgents, firebaseError, setActiveAgents }) {
  const [runningSwarms, setRunningSwarms] = useState({
    video: false,
    research: false,
    core: false
  });

  // Sync local button state with DB
  useEffect(() => {
    setRunningSwarms({
      video: activeAgents.some(a => a.swarmId === 'video'),
      research: activeAgents.some(a => a.swarmId === 'research'),
      core: activeAgents.some(a => a.swarmId === 'core'),
    });
  }, [activeAgents]);

  const toggleSwarm = async (id, count, swarmType, taskPrefix) => {
    const isCurrentlyRunning = runningSwarms[id];
    
    // Optimistic / Fallback UI update
    setRunningSwarms(prev => ({ ...prev, [id]: !isCurrentlyRunning }));
    
    if (firebaseError) {
      // Degraded simulation mode
      if (isCurrentlyRunning) {
        setActiveAgents(current => current.filter(agent => agent.swarmId !== id));
      } else {
        const newAgents = Array.from({ length: count }).map((_, i) => ({
          id: `${id}-node-${i}`,
          swarmId: id,
          type: swarmType,
          task: `${taskPrefix} partition ${i}`,
          load: Math.floor(Math.random() * 40) + 10 + '%',
          color: id === 'core' ? '#D4AF37' : '#F0F4F8',
          position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
          scale: Math.random() * 0.15 + 0.1,
          speed: Math.random() * 0.2 + 0.1,
          speedOffset: Math.random() * Math.PI * 2,
        }));
        setActiveAgents(current => [...current, ...newAgents]);
      }
      return;
    }

    // Real Firebase Logic
    try {
      const batch = writeBatch(db);
      
      if (isCurrentlyRunning) {
        // Destroy swarm
        const querySnapshot = await getDocs(collection(db, "activeAgents"));
        querySnapshot.forEach((document) => {
          if (document.data().swarmId === id) {
            batch.delete(doc(db, "activeAgents", document.id));
          }
        });
      } else {
        // Generate and push swarm to DB
        for(let i=0; i<count; i++) {
          const agentId = `${id}-node-${i}`;
          const agentRef = doc(db, "activeAgents", agentId);
          batch.set(agentRef, {
            swarmId: id,
            type: swarmType,
            task: `${taskPrefix} partition ${i}`,
            load: Math.floor(Math.random() * 40) + 10 + '%',
            color: id === 'core' ? '#D4AF37' : '#F0F4F8',
            position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
            scale: Math.random() * 0.15 + 0.1,
            speed: Math.random() * 0.2 + 0.1,
            speedOffset: Math.random() * Math.PI * 2,
          });
        }
      }
      await batch.commit();
    } catch (e) {
      console.error("Failed to execute DB transaction", e);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="widget-header">
        <h2 className="widget-title">
          <Zap size={20} color="#D4AF37" />
          CONSTELLATION FACTORY
        </h2>
        <button className="glass-button primary" onClick={() => toggleSwarm('manual', 5, 'General', 'Awaiting task')}>
          NEW SWARM
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '32px', fontFamily: 'JetBrains Mono' }}>
        Deploy parallel crews to Firestore. Hover over orbs in canvas to view live DB metrics.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="agent-card">
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '0.05em' }}>CINEMATIC VIDEO SWARM</h3>
              {runningSwarms.video ? <span className="badge active">RUNNING</span> : <span className="badge">STANDBY</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontFamily: 'JetBrains Mono' }}>
              Imagen 3 + VideoFX (4K). 30 nodes.
            </p>
          </div>
          <button 
            className="glass-button" 
            style={{ padding: '12px', borderRadius: '50%' }}
            onClick={() => toggleSwarm('video', 30, 'Video Render', 'Rendering frame batch')} // Scaled down to 30 for DB performance limits
          >
            {runningSwarms.video ? <Loader className="floating" size={16} /> : <Play size={16} />}
          </button>
        </div>

        <div className="agent-card">
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '0.05em' }}>RESEARCH NEBULA</h3>
              {runningSwarms.research ? <span className="badge active">RUNNING</span> : <span className="badge">STANDBY</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontFamily: 'JetBrains Mono' }}>
              Google Knowledge Graph Sync. 15 nodes.
            </p>
          </div>
          <button 
            className="glass-button" 
            style={{ padding: '12px', borderRadius: '50%' }}
            onClick={() => toggleSwarm('research', 15, 'Data Indexing', 'Crawling subgraph')}
          >
            {runningSwarms.research ? <Loader className="floating" size={16} /> : <Play size={16} />}
          </button>
        </div>

        <div className="agent-card">
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', letterSpacing: '0.05em' }}>SELF-EVOLVING CORE</h3>
              {runningSwarms.core ? <span className="badge active">ACTIVE</span> : <span className="badge">STANDBY</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontFamily: 'JetBrains Mono' }}>
              Society of Mind debate. 5 nodes.
            </p>
          </div>
          <button 
            className="glass-button" 
            style={{ padding: '12px', borderRadius: '50%' }}
            onClick={() => toggleSwarm('core', 5, 'Debate Engine', 'Hypothesizing architecture')}
          >
            {runningSwarms.core ? <Loader className="floating" size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
