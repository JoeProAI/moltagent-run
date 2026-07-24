import React from 'react';

// The signature element: navigation as carapace segments. Six plates in a
// row, the active one lit through its bottom seam like a lifting plate.
export default function Sidebar({ activeWidget, setActiveWidget, setConstellation }) {
  const plates = [
    { id: 'android-studio', num: 'S1', label: 'ANDROID SWARM', role: '5-agent build crew', mode: 'android-party' },
    { id: 'carapace-firewall', num: 'S2', label: 'CARAPAX FIREWALL', role: 'Memory integrity', mode: 'carapace-sec' },
    { id: 'mecha-run', num: 'S3', label: 'M.E.C.H.A. RUN', role: '60-agent orchestrator', mode: 'mecha-party' },
    { id: 'factory', num: 'S4', label: 'AGENT FACTORY', role: 'Spawn swarm crews', mode: 'cinematic' },
    { id: 'x-growth', num: 'S5', label: 'X MULTIPLIER', role: '@JoePro growth studio', mode: 'x-growth' },
    { id: 'bridge', num: 'S6', label: 'HYBRID BRIDGE', role: 'Local-cloud routing', mode: 'research' },
  ];

  return (
    <nav className="plate-nav" aria-label="Studio modules">
      {plates.map(plate => (
        <button
          key={plate.id}
          type="button"
          className={`plate ${activeWidget === plate.id ? 'active' : ''}`}
          aria-current={activeWidget === plate.id ? 'page' : undefined}
          onClick={() => {
            setActiveWidget(plate.id);
            setConstellation(plate.mode);
          }}
        >
          <span className="plate-id">{plate.num}</span>
          <span className="plate-label">{plate.label}</span>
          <span className="plate-role">{plate.role}</span>
        </button>
      ))}
    </nav>
  );
}
