export default function TopBar({ activeNodes }) {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark">JOEPRO<em>AI</em></span>
        <span className="brand-tag">Stop soloing, start conducting</span>
      </div>

      <div className="telemetry">
        <span className="chip">
          <span className="dot hot" />
          Compute
          <strong>{isLocalHost ? 'RTX 5080 local' : 'Live demo'}</strong>
        </span>
        <span className="chip">
          <span className={`dot ${activeNodes > 0 ? 'ok' : ''}`} />
          Swarm
          <strong>{activeNodes > 0 ? `${activeNodes} agents live` : 'Explore the modules →'}</strong>
        </span>
        <span className="chip">
          <span className="dot ok" />
          Builds
          <strong>Open source</strong>
        </span>
      </div>

      <div className="identity">
        <div>
          <div className="identity-name">JoePro AI</div>
          <div className="identity-plan">@JoePro</div>
        </div>
        <div className="identity-sigil" aria-hidden="true">JP</div>
      </div>
    </header>
  );
}
