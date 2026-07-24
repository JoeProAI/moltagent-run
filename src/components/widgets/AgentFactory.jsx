import React, { useState, useEffect } from 'react';
import { Play, Square, Network, Loader } from 'lucide-react';
import { db, doc, collection, getDocs, writeBatch } from '../../firebase';

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
          color: id === 'core' ? '#E8A832' : '#EFE7D6',
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
        for (let i = 0; i < count; i++) {
          const agentId = `${id}-node-${i}`;
          const agentRef = doc(db, "activeAgents", agentId);
          batch.set(agentRef, {
            swarmId: id,
            type: swarmType,
            task: `${taskPrefix} partition ${i}`,
            load: Math.floor(Math.random() * 40) + 10 + '%',
            color: id === 'core' ? '#E8A832' : '#EFE7D6',
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

  const swarms = [
    {
      id: 'video',
      name: 'Cinematic video swarm',
      nodes: 30,
      desc: 'Imagen 3 + VideoFX rendering at 4K across 30 parallel nodes.',
      type: 'Video Render',
      prefix: 'Rendering frame batch'
    },
    {
      id: 'research',
      name: 'Research nebula',
      nodes: 15,
      desc: 'Google Knowledge Graph sync across 15 crawler nodes.',
      type: 'Data Indexing',
      prefix: 'Crawling subgraph'
    },
    {
      id: 'core',
      name: 'Self-evolving core',
      nodes: 5,
      desc: 'Society-of-Mind debate loop across 5 reasoning nodes.',
      type: 'Debate Engine',
      prefix: 'Hypothesizing architecture'
    }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S4 · Agent factory</div>
          <h2 className="masthead-title">Spawn and retire swarm crews</h2>
          <p className="masthead-sub">
            Each crew writes live agent nodes to Firestore. Hover the orbs in the ambient canvas
            to inspect any node's task and load in real time.
          </p>
        </div>
        <div className="masthead-actions">
          <button
            type="button"
            className="btn"
            onClick={() => toggleSwarm('manual', 5, 'General', 'Awaiting task')}
          >
            <Network size={14} />
            Spawn custom swarm
          </button>
        </div>
      </div>

      <div className="grid cols-3">
        {swarms.map(swarm => {
          const running = runningSwarms[swarm.id];
          return (
            <div key={swarm.id} className="panel" style={running ? { borderColor: 'var(--amber)' } : undefined}>
              <div className="panel-head">
                <div className="panel-title">{swarm.name}</div>
                <span className={`badge ${running ? 'hot' : ''}`}>{running ? 'Running' : 'Standby'}</span>
              </div>
              <p className="panel-sub">{swarm.desc}</p>

              <div className={`segmeter ${running ? 'running' : ''}`} aria-hidden="true" style={{ marginBottom: 'var(--sp-4)' }}>
                {[...Array(10)].map((_, i) => (
                  <span key={i} className={running && i < Math.ceil(swarm.nodes / 3) ? 'lit' : ''} />
                ))}
              </div>

              <button
                type="button"
                className={`btn ${running ? '' : 'primary'}`}
                style={{ width: '100%' }}
                onClick={() => toggleSwarm(swarm.id, swarm.nodes, swarm.type, swarm.prefix)}
              >
                {running ? <Square size={14} /> : <Play size={14} />}
                {running ? 'Stop swarm' : `Launch ${swarm.nodes} nodes`}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
