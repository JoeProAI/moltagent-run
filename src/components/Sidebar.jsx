export default function Sidebar({ activeWidget, setActiveWidget, setConstellation }) {
  const plates = [
    { id: 'android-studio', num: 'S1', label: 'APP SWARM', role: 'Multi-agent coding', mode: 'android-party' },
    { id: 'carapace-firewall', num: 'S2', label: 'CARAPAX FIREWALL', role: 'Memory integrity', mode: 'carapace-sec' },
    { id: 'mecha-run', num: 'S3', label: 'M.E.C.H.A. RUN', role: 'Quad-crew debate', mode: 'mecha-party' },
    { id: 'factory', num: 'S4', label: 'AGENT FACTORY', role: 'Spawn swarm crews', mode: 'cinematic' },
    { id: 'x-growth', num: 'S5', label: 'X MULTIPLIER', role: 'Content growth engine', mode: 'x-growth' },
    { id: 'bridge', num: 'S6', label: 'OUTPOST LAUNCHER', role: 'Devin outposts on Daytona', mode: 'research' },
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
