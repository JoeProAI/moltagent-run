import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { db, doc, collection, query, where, getDocs, writeBatch } from '../../firebase';

export default function AgentFactory({ activeAgents, cloudSync, sessionId, setActiveAgents }) {
  const [runningSwarms, setRunningSwarms] = useState({
    video: false,
    research: false,
    core: false
  });

  // Firestore snapshot (already scoped to this session) is the source of truth
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setRunningSwarms({
      video: activeAgents.some(a => a.swarmId === 'video'),
      research: activeAgents.some(a => a.swarmId === 'research'),
      core: activeAgents.some(a => a.swarmId === 'core'),
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [activeAgents]);

  const buildNode = (id, i, swarmType, taskPrefix) => ({
    owner: sessionId,
    swarmId: id,
    type: swarmType,
    task: `${taskPrefix} partition ${i}`,
    load: Math.floor(Math.random() * 40) + 10 + '%',
    color: id === 'core' ? '#E8A832' : '#EDF1FC',
    position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
    scale: Math.random() * 0.15 + 0.1,
    speed: Math.random() * 0.2 + 0.1,
    speedOffset: Math.random() * Math.PI * 2,
  });

  const toggleSwarm = async (id, count, swarmType, taskPrefix) => {
    const isCurrentlyRunning = runningSwarms[id];

    // Optimistic UI update
    setRunningSwarms(prev => ({ ...prev, [id]: !isCurrentlyRunning }));

    if (!cloudSync) {
      // Browser-local sandbox
      if (isCurrentlyRunning) {
        setActiveAgents(current => current.filter(agent => agent.swarmId !== id));
      } else {
        const newAgents = Array.from({ length: count }).map((_, i) => ({
          ...buildNode(id, i, swarmType, taskPrefix),
          id: `${id}-node-${i}`
        }));
        setActiveAgents(current => [...current, ...newAgents]);
      }
      return;
    }

    // Cloud sync — every doc is owner-scoped and id-prefixed so sessions never collide
    try {
      const batch = writeBatch(db);

      if (isCurrentlyRunning) {
        // Destroy only this session's nodes for this swarm
        const ownScope = query(collection(db, 'activeAgents'), where('owner', '==', sessionId));
        const snapshot = await getDocs(ownScope);
        snapshot.forEach((document) => {
          if (document.data().swarmId === id) {
            batch.delete(doc(db, 'activeAgents', document.id));
          }
        });
      } else {
        for (let i = 0; i < count; i++) {
          const agentRef = doc(db, 'activeAgents', `${sessionId}__${id}-node-${i}`);
          batch.set(agentRef, buildNode(id, i, swarmType, taskPrefix));
        }
      }
      await batch.commit();
    } catch (e) {
      console.error('Failed to execute DB transaction', e);
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
            Each crew launches live agent nodes into your private session. Hover the orbs in the
            ambient canvas to inspect any node's task and load in real time.
          </p>
        </div>
        <div className="masthead-actions">
          <span className="badge">{cloudSync ? 'Synced to your session' : 'Local sandbox'}</span>
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
