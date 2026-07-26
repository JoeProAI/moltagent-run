import { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import AndroidStudio from './AndroidStudio';
import CarapaceFirewall from './CarapaceFirewall';
import AgentFactory from './AgentFactory';

// The Lab — concept demos, clearly labeled. These are interactive mockups of
// ideas in progress; nothing here runs real compute or spends real money.
export default function Lab({ setActiveAgents, activeAgents }) {
  const [activeConcept, setActiveConcept] = useState('swarm');

  const concepts = [
    { id: 'swarm', label: 'BUILD SWARM' },
    { id: 'carapax', label: 'CARAPAX FIREWALL' },
    { id: 'factory', label: 'AGENT FACTORY' }
  ];

  return (
    <div className="module">
      <div className="panel" style={{ borderColor: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <FlaskConical size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
          <p className="panel-sub" style={{ marginBottom: 0 }}>
            <strong style={{ color: 'var(--frost)' }}>Concept demo.</strong> Everything below is an
            interactive mockup — simulated logs, no real compute, nothing billed.
          </p>
        </div>
        <div className="tabset" role="tablist">
          {concepts.map(concept => (
            <button
              key={concept.id}
              type="button"
              role="tab"
              aria-selected={activeConcept === concept.id}
              className={`tab ${activeConcept === concept.id ? 'active' : ''}`}
              onClick={() => setActiveConcept(concept.id)}
            >
              {concept.label}
            </button>
          ))}
        </div>
      </div>

      {activeConcept === 'swarm' && (
        <AndroidStudio setActiveAgents={setActiveAgents} activeAgents={activeAgents} />
      )}
      {activeConcept === 'carapax' && <CarapaceFirewall />}
      {activeConcept === 'factory' && (
        <AgentFactory setActiveAgents={setActiveAgents} activeAgents={activeAgents} />
      )}
    </div>
  );
}
