import { useState } from 'react';
import { Cpu, Play, RefreshCw } from 'lucide-react';

// Debate — four Grok agents argue an engineering task via /api/mecha-debate.
// Falls back to a clearly-labeled scripted debate when XAI_API_KEY isn't set.
export default function MechaRun({ setActiveAgents }) {
  const [mechaPrompt, setMechaPrompt] = useState('Should we build our new API in Node or Go, given a two-person team that ships weekly?');
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);
  const [debateLive, setDebateLive] = useState(null);
  const [quadLogs, setQuadLogs] = useState([]);

  const roleTitles = {
    PILOT: 'Plans it',
    HARPER: 'Researches it',
    BENJAMIN: 'Attacks it',
    LUCAS: 'Decides it'
  };

  const spawnOrbs = () => {
    setActiveAgents?.(Array.from({ length: 4 }).map((_, i) => ({
      id: `debate-${i}`,
      type: 'Grok agent',
      task: Object.keys(roleTitles)[i],
      load: '90%',
      color: '#E8A832',
      position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
      scale: 0.3,
      speed: 0.12,
      speedOffset: Math.random() * Math.PI
    })));
  };

  const handleLaunch = async () => {
    if (isSwarmRunning) return;
    setIsSwarmRunning(true);
    setDebateLive(null);
    setQuadLogs([]);
    spawnOrbs();

    let steps;
    let live = false;
    try {
      const response = await fetch('/api/mecha-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: mechaPrompt })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        live = true;
        steps = result.transcript.map(t => ({ role: t.role, msg: t.msg }));
      }
    } catch {
      // fall through to the scripted example
    }

    if (!steps) {
      steps = [
        { role: 'PILOT', msg: 'Example debate (live runs need the Grok key): plan is a Node API with Fastify, Postgres, and one deploy target.' },
        { role: 'HARPER', msg: 'Research says: your team already writes TypeScript daily; Go would add a learning tax to every ship week.' },
        { role: 'BENJAMIN', msg: 'Biggest risk: Node under CPU-bound load. If any endpoint does heavy compute, this plan degrades badly.' },
        { role: 'LUCAS', msg: 'Verdict: Node now for velocity; isolate any CPU-heavy work behind a queue so it can move to Go later without a rewrite.' }
      ];
    }
    setDebateLive(live);

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setQuadLogs(prev => [...prev, { ...step, time: new Date().toLocaleTimeString() }]);
        if (idx === steps.length - 1) {
          setIsSwarmRunning(false);
          setActiveAgents?.([]);
        }
      }, (idx + 1) * 700);
    });
  };

  const crew = [
    { role: 'PILOT', title: 'Plans it', desc: 'Breaks your task into a concrete plan and names the key decision.' },
    { role: 'HARPER', title: 'Researches it', desc: 'Surfaces the facts and constraints that change the approach.' },
    { role: 'BENJAMIN', title: 'Attacks it', desc: 'Names the biggest risk and how the plan fails in practice.' },
    { role: 'LUCAS', title: 'Decides it', desc: 'Delivers the verdict and the first concrete action.' }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">Debate</div>
          <h2 className="masthead-title">Four Grok agents argue your task</h2>
          <p className="masthead-sub">
            Type an engineering decision or task. One agent plans it, one researches it, one
            attacks it, one delivers the verdict — a full debate in about twenty seconds.
          </p>
        </div>
        <div className="masthead-actions">
          {debateLive === true && <span className="badge ok">Live Grok</span>}
          {debateLive === false && <span className="badge">Example — needs XAI_API_KEY</span>}
        </div>
      </div>

      <div className="grid cols-main-side">

        <div className="stack">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Cpu size={15} />
                Your task or decision
              </div>
            </div>

            <textarea
              aria-label="Task for the debate"
              className="textarea"
              value={mechaPrompt}
              onChange={(e) => setMechaPrompt(e.target.value)}
              rows={3}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleLaunch}
                  disabled={isSwarmRunning}
                >
                  {isSwarmRunning ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                  {isSwarmRunning ? 'Debating…' : 'Start the debate'}
                </button>
                <span className="btn-hint">Four Grok turns, each sees the debate so far</span>
              </div>
            </div>
          </div>

          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">The debate</div>
            </div>
            <div className="console" style={{ maxHeight: '340px' }}>
              {quadLogs.length === 0 && (
                <div className="log-row"><span className="log-msg">Start a debate to see the four agents argue it here.</span></div>
              )}
              {quadLogs.map((log, idx) => (
                <div key={idx} className="log-row">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-agent">{log.role}</span>
                  <span className="log-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <span className="field-label">The crew — who does what</span>
          {crew.map((member, i) => (
            <div key={i} className="roster-row">
              <div className="roster-head">
                <span className="roster-name">{member.role}</span>
              </div>
              <div className="roster-role">{member.title}</div>
              <p className="roster-desc">{member.desc}</p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
