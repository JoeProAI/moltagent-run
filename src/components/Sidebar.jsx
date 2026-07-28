// The signature element: navigation as carapace segments. Plain names, one
// job each — Home explains everything, tools are real, the Lab is labeled.
export default function Sidebar({ activeWidget, setActiveWidget, setConstellation }) {
  const plates = [
    { id: 'home', num: '01', label: 'COMMAND', role: 'System overview', mode: 'research' },
    { id: 'guide', num: '02', label: 'FIELD GUIDE', role: 'Devin Outposts manual', mode: 'research' },
    { id: 'bridge', num: '03', label: 'OUTPOSTS', role: 'Sandbox control', mode: 'research' },
    { id: 'lab', num: '04', label: 'PROVING GROUND', role: 'Concept systems', mode: 'cinematic' },
  ];

  return (
    <nav className="plate-nav" aria-label="Site sections">
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
