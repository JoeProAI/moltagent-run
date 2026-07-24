export default function TopBar({ daytonaCredits, activeNodes }) {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">MOLT<em>AGENT</em>.RUN</span>
        <span className="brand-tag">Swarm Workbench</span>
      </div>

      <div className="telemetry">
        <span className="chip">
          <span className="dot hot" />
          Compute
          <strong>{isLocalHost ? 'RTX 5080 local' : 'Cloud inference'}</strong>
        </span>
        <span className="chip">
          <span className={`dot ${activeNodes > 0 ? 'ok' : ''}`} />
          Swarm
          <strong>{activeNodes > 0 ? `${activeNodes} agents live` : 'Idle, ready to dispatch'}</strong>
        </span>
        <span className="chip">
          <span className="dot ok" />
          Carapax
          <strong>5 planes armed</strong>
        </span>
        <span className="chip">
          Daytona credits
          <strong>{daytonaCredits.toLocaleString()}</strong>
        </span>
      </div>

      <div className="identity">
        <div>
          <div className="identity-name">JP (@JoePro)</div>
          <div className="identity-plan">Pro swarm</div>
        </div>
        <div className="identity-sigil" aria-hidden="true">JP</div>
      </div>
    </header>
  );
}
