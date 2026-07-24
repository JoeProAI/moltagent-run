import { useState } from 'react';
import {
  Zap,
  Cpu,
  DollarSign,
  Play,
  RefreshCw,
  Brain,
  CreditCard
} from 'lucide-react';
import { db, doc, collection, query, where, getDocs, writeBatch } from '../../firebase';

export default function MechaRun({ cloudSync, sessionId, setActiveAgents }) {
  const [activeTab, setActiveTab] = useState('mecha-engine');
  const [mechaPrompt, setMechaPrompt] = useState('Audit Android codebase, generate Jetpack Compose design system, and execute 10-agent Codex swarm sweep');
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);
  const [codexCount, setCodexCount] = useState(10);
  const [checkoutStatus, setCheckoutStatus] = useState(null);

  // Dispatched Codex agents become live nodes in this session's swarm so the
  // header count and ambient canvas react to a real dispatch. Every doc is
  // owner-scoped so concurrent visitors never collide.
  const spawnMechaAgents = async (count) => {
    const agents = Array.from({ length: count }).map((_, i) => ({
      owner: sessionId,
      swarmId: 'mecha',
      type: 'Codex Sandbox',
      task: `Parallel sweep partition ${i}`,
      load: Math.floor(Math.random() * 40) + 55 + '%',
      color: '#E8A832',
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
      scale: Math.random() * 0.15 + 0.12,
      speed: Math.random() * 0.2 + 0.1,
      speedOffset: Math.random() * Math.PI * 2
    }));

    if (!cloudSync) {
      setActiveAgents?.(current => [
        ...current.filter(a => a.swarmId !== 'mecha'),
        ...agents.map((a, i) => ({ ...a, id: `mecha-node-${i}` }))
      ]);
      return;
    }
    try {
      const batch = writeBatch(db);
      agents.forEach((agent, i) => {
        batch.set(doc(db, 'activeAgents', `${sessionId}__mecha-node-${i}`), agent);
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to persist MECHA swarm', e);
    }
  };

  const clearMechaAgents = async () => {
    if (!cloudSync) {
      setActiveAgents?.(current => current.filter(a => a.swarmId !== 'mecha'));
      return;
    }
    try {
      const batch = writeBatch(db);
      const ownScope = query(collection(db, 'activeAgents'), where('owner', '==', sessionId));
      const snapshot = await getDocs(ownScope);
      snapshot.forEach(document => {
        if (document.data().swarmId === 'mecha') {
          batch.delete(doc(db, 'activeAgents', document.id));
        }
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to clear MECHA swarm', e);
    }
  };

  const handleCheckout = async (tierId, tierName) => {
    setCheckoutStatus({ tier: tierId, state: 'loading' });
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId })
      });
      const result = await response.json();
      if (result.success && result.url) {
        // eslint-disable-next-line react-hooks/immutability -- intentional checkout redirect
        window.location.href = result.url;
        return;
      }
      setCheckoutStatus({
        tier: tierId,
        state: 'error',
        message: result.message || `Checkout for ${tierName} isn't live yet.`
      });
    } catch (err) {
      setCheckoutStatus({ tier: tierId, state: 'error', message: `Checkout unreachable: ${err.message}` });
    }
  };

  const [quadLogs, setQuadLogs] = useState([
    { role: 'PILOT', agent: 'Grok Leader', time: '08:45:01', msg: 'Initiating M.E.C.H.A. 60-agent swarm dispatch.' },
    { role: 'HARPER', agent: 'Researcher', time: '08:45:03', msg: 'Surfacing gBrain memory context and past Android layout benchmarks.' },
    { role: 'BENJAMIN', agent: 'Critic & Logic', time: '08:45:05', msg: 'Challenging assumptions: Verify thread safety on main UI looper.' },
    { role: 'LUCAS', agent: 'Executor', time: '08:45:07', msg: 'Generating executable Kotlin Compose snippets and Gradle build scripts.' }
  ]);

  const gBrainKnowledge = [
    { title: 'MECHA-STACK.md', category: 'Architecture', size: '19.3 KB', vectors: '1,420', status: 'SYNCHRONIZED' },
    { title: 'NOESIS_BRIDGE.md', category: 'Memory Truth', size: '8.7 KB', vectors: '850', status: 'SYNCHRONIZED' },
    { title: 'EMPIRE_STACK.md', category: 'Monetization', size: '11.4 KB', vectors: '1,110', status: 'SYNCHRONIZED' },
    { title: 'Android CLI Specialist', category: 'Skill Matrix', size: '9.2 KB', vectors: '640', status: 'ACTIVE' }
  ];

  const handleLaunchMechaSwarm = () => {
    if (isSwarmRunning) return;
    setIsSwarmRunning(true);
    spawnMechaAgents(codexCount);

    const steps = [
      { role: 'PILOT', agent: 'Grok Leader', msg: `Broadcasting task across ${codexCount} Codex cloud sandboxes.` },
      { role: 'HARPER', agent: 'Researcher', msg: 'Querying gBrain Limitless ingest for UI vector embeddings.' },
      { role: 'BENJAMIN', agent: 'Critic & Logic', msg: 'Stress testing memory safety & async coroutine locks.' },
      { role: 'LUCAS', agent: 'Executor', msg: `Swarm run completed. ${codexCount} parallel tasks synthesized into production build.` }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString();
        setQuadLogs(prev => [...prev, { ...step, time: timeStr }]);
        if (idx === steps.length - 1) {
          setIsSwarmRunning(false);
          clearMechaAgents();
        }
      }, (idx + 1) * 800);
    });
  };

  const crew = [
    { role: 'PILOT', title: 'Leader & coordinator', desc: 'Synthesizes consensus and delivers the definitive answer.' },
    { role: 'HARPER', title: 'Researcher & analyst', desc: 'Surfaces facts, context and historical memory data.' },
    { role: 'BENJAMIN', title: 'Critic & logician', desc: 'Challenges assumptions and stress-tests edge cases.' },
    { role: 'LUCAS', title: 'Executor & specialist', desc: 'Translates theory into concrete, buildable code.' }
  ];

  const tiers = [
    {
      id: 'developer',
      name: 'Developer',
      price: '$29',
      period: '/month',
      desc: 'Solo Android developers and indie hackers',
      featured: false,
      features: ['5 concurrent agents', 'Android CLI emulator bridge', 'Jetpack Compose code generator', 'Standard gBrain memory']
    },
    {
      id: 'swarm-pro',
      name: 'Swarm Pro',
      price: '$99',
      period: '/month',
      desc: 'Mobile dev teams and studios',
      featured: true,
      features: ['25 concurrent Codex agents', 'Full M.E.C.H.A. Quad Crew debate', 'Automated ADB journey testing', 'Unlimited gBrain vector ingest']
    },
    {
      id: 'enterprise-swarm',
      name: 'Enterprise Swarm',
      price: '$499',
      period: '/month',
      desc: 'Enterprise Android engineering teams',
      featured: false,
      features: ['50+ parallel cloud sandboxes', 'Custom skill & MCP integrations', 'Dedicated Daytona execution outpost', 'SLA 99.9% + 24/7 agent monitoring']
    }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S3 · M.E.C.H.A. Run</div>
          <h2 className="masthead-title">Sixty agents, four voices, one answer</h2>
          <p className="masthead-sub">
            The Quad Crew debates every task — leader, researcher, critic, executor — then fans it
            out across up to 50 Codex cloud sandboxes and synthesizes the results.
          </p>
        </div>
        <div className="masthead-actions">
          <div className="tabset" role="tablist">
            {[
              { id: 'mecha-engine', label: 'SWARM ENGINE', icon: <Zap size={13} /> },
              { id: 'gbrain-vault', label: 'gBRAIN VAULT', icon: <Brain size={13} /> },
              { id: 'monetization-hub', label: 'SAAS TIERS', icon: <DollarSign size={13} /> }
            ].map(tab => (
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
        </div>
      </div>

      {/* TAB 1: SWARM DISPATCHER */}
      {activeTab === 'mecha-engine' && (
        <div className="grid cols-main-side">

          <div className="stack">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  <Cpu size={15} />
                  Swarm dispatcher
                </div>
                <span className="panel-note">Quad Crew debate → Codex fan-out</span>
              </div>

              <label className="field-label" htmlFor="mecha-prompt">Task for the swarm</label>
              <textarea
                id="mecha-prompt"
                className="textarea"
                value={mechaPrompt}
                onChange={(e) => setMechaPrompt(e.target.value)}
                rows={3}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flex: 1, minWidth: '220px' }}>
                  <label htmlFor="codex-count" style={{ fontSize: '0.7rem', color: 'var(--frost-2)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    Codex agents: <strong style={{ color: 'var(--amber)' }}>{codexCount}</strong>
                  </label>
                  <input
                    id="codex-count"
                    type="range"
                    min={1}
                    max={50}
                    value={codexCount}
                    onChange={(e) => setCodexCount(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={handleLaunchMechaSwarm}
                    disabled={isSwarmRunning}
                  >
                    {isSwarmRunning ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                    {isSwarmRunning ? 'Dispatching…' : `Dispatch ${codexCount}-agent swarm`}
                  </button>
                  <span className="btn-hint">Spawns {codexCount} live nodes in the swarm canvas</span>
                </div>
              </div>
            </div>

            <div className="panel sunken">
              <div className="panel-head">
                <div className="panel-title">Quad Crew debate stream</div>
                <span className="panel-note">port 8766 · live</span>
              </div>
              <div className="console">
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
            <span className="field-label">Quad Crew — four Grok voices</span>
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
      )}

      {/* TAB 2: gBRAIN KNOWLEDGE VAULT */}
      {activeTab === 'gbrain-vault' && (
        <div className="stack">
          <div className="panel-head" style={{ marginBottom: 0 }}>
            <div className="panel-title">
              <Brain size={15} />
              gBrain vector vault — the swarm's grounded memory
            </div>
            <span className="panel-note">Documents the crew can cite as truth</span>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {gBrainKnowledge.map((item, index) => (
              <div key={index} className="panel">
                <div className="panel-head" style={{ marginBottom: 'var(--sp-2)' }}>
                  <span className="panel-title" style={{ fontSize: '0.8rem' }}>{item.title}</span>
                  <span className={`badge ${item.status === 'ACTIVE' ? 'hot' : 'ok'}`}>{item.status}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--frost-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Category · <span style={{ color: 'var(--frost)' }}>{item.category}</span></div>
                  <div>Size · {item.size}</div>
                  <div>Vector embeddings · <span style={{ color: 'var(--amber)' }}>{item.vectors}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAAS MONETIZATION */}
      {activeTab === 'monetization-hub' && (
        <div className="stack">

          <div className="panel">
            <div className="panel-title" style={{ marginBottom: '4px' }}>Roadmap to $10,000/mo MRR</div>
            <p className="panel-sub" style={{ marginBottom: 0 }}>
              Package the M.E.C.H.A. Android agent studio as a commercial SaaS: multi-agent cloud
              execution, Jetpack Compose generation, and ADB testing sold to mobile dev teams.
            </p>
          </div>

          <div className="grid cols-3">
            {tiers.map((plan, idx) => (
              <div key={idx} className={`tier ${plan.featured ? 'featured' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tier-name">{plan.name}</span>
                  {plan.featured && <span className="badge hot">Most popular</span>}
                </div>
                <div className="tier-price">{plan.price}<span>{plan.period}</span></div>
                <p className="tier-audience">{plan.desc}</p>

                <ul className="tier-features">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`btn ${plan.featured ? 'primary' : ''}`}
                  style={{ width: '100%' }}
                  disabled={checkoutStatus?.tier === plan.id && checkoutStatus.state === 'loading'}
                  onClick={() => handleCheckout(plan.id, plan.name)}
                >
                  {checkoutStatus?.tier === plan.id && checkoutStatus.state === 'loading'
                    ? 'Opening checkout…'
                    : `Start ${plan.name} — ${plan.price}/mo`}
                </button>

                {checkoutStatus?.tier === plan.id && checkoutStatus.state === 'error' && (
                  <p style={{ fontSize: '0.65rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)', marginTop: 'var(--sp-2)' }}>
                    {checkoutStatus.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">
                <CreditCard size={15} />
                Billing & API keys
              </div>
              <span className="panel-note">Stripe integration</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--frost-2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Domain target · <span style={{ color: 'var(--frost)' }}>https://moltagent.run</span></div>
              <div>Secret API key · <code style={{ color: 'var(--amber)', background: 'var(--ink-2)', padding: '2px 6px' }}>molt_live_sk_948271038a8e1b</code></div>
              <div>Monthly API credit allowance · <span style={{ color: 'var(--frost)' }}>100,000 / 100,000 credits</span></div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
