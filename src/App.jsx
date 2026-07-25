import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import MouseConstellation from './components/MouseConstellation';
import ErrorBoundary from './components/ErrorBoundary';
import AndroidStudio from './components/widgets/AndroidStudio';
import CarapaceFirewall from './components/widgets/CarapaceFirewall';
import MechaRun from './components/widgets/MechaRun';
import AgentFactory from './components/widgets/AgentFactory';
import XGrowth from './components/widgets/XGrowth';
import NOESISBridge from './components/widgets/NOESISBridge';

const Canvas3D = lazy(() => import('./components/Canvas3D'));

function App() {
  const [activeWidget, setActiveWidget] = useState('android-studio');
  const [constellation, setConstellation] = useState('android-party');
  const [activeAgents, setActiveAgents] = useState([]);

  // Derive canvas constellation from active widget
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const map = {
      'android-studio': 'android-party',
      'carapace-firewall': 'carapace-sec',
      'mecha-run': 'mecha-party',
      'factory': 'cinematic',
      'x-growth': 'x-growth',
      'bridge': 'research',
    };
    setConstellation(map[activeWidget] || 'research');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [activeWidget]);

  return (
    <div className="app-shell">
      <MouseConstellation />

      <header className="header" style={{ marginBottom: 0 }}>
        <div className="brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
          <span className="brand-mark">JOEPRO<em>AI</em></span>
          <span className="brand-tag" style={{ fontSize: '0.6rem', marginTop: 0 }}>
            Stop soloing, start conducting
          </span>
        </div>
        <div className="telemetry">
          <span className="chip">
            <span className="dot hot" />
            <strong>Multi-agent systems</strong>
          </span>
          <span className="chip">
            <span className="dot ok" />
            <strong>Open source</strong>
          </span>
          {activeAgents.length > 0 && (
            <span className="chip">
              <span className="dot ok" />
              <strong>{activeAgents.length} agents live</strong>
            </span>
          )}
        </div>
        <div className="identity">
          <div>
            <div className="identity-name">JoePro AI</div>
            <div className="identity-plan">@JoePro</div>
          </div>
          <div className="identity-sigil" aria-hidden="true">JP</div>
        </div>
      </header>

      <Sidebar
        activeWidget={activeWidget}
        setActiveWidget={setActiveWidget}
        setConstellation={setConstellation}
      />

      <main className="workspace">
        <Suspense fallback={null}>
          <Canvas3D constellationMode={constellation} activeAgents={activeAgents} />
        </Suspense>

        <ErrorBoundary key={activeWidget}>
          {activeWidget === 'android-studio' && (
            <AndroidStudio setActiveAgents={setActiveAgents} activeAgents={activeAgents} />
          )}
          {activeWidget === 'x-growth' && (
            <XGrowth setActiveAgents={setActiveAgents} />
          )}
          {activeWidget === 'carapace-firewall' && (
            <CarapaceFirewall />
          )}
          {activeWidget === 'mecha-run' && (
            <MechaRun setActiveAgents={setActiveAgents} />
          )}
          {activeWidget === 'factory' && (
            <AgentFactory setActiveAgents={setActiveAgents} activeAgents={activeAgents} />
          )}
          {activeWidget === 'bridge' && (
            <NOESISBridge
              isSynced={false}
              setIsSynced={() => {}}
              daytonaCredits={0}
              setDaytonaCredits={() => {}}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Footer — always visible */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '12px 24px',
        background: 'var(--ink)',
        borderTop: '1px solid var(--seam)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--frost-2)',
        flexWrap: 'wrap',
        gap: 'var(--sp-2)',
      }}>
        <span>
          Built by{' '}
          <a href="https://x.com/JoePro" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--amber)', textDecoration: 'none' }}>@JoePro</a>
          {' '}· Multi-agent swarm workbench
        </span>
        <span style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <a href="https://youtube.com/@JoeProAI" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--frost-2)', textDecoration: 'none' }}>YouTube</a>
          <a href="https://x.com/JoePro" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--frost-2)', textDecoration: 'none' }}>X / Twitter</a>
          <a href="https://tiktok.com/@JoeProAI" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--frost-2)', textDecoration: 'none' }}>TikTok</a>
          <a href="https://github.com/JoeProAI" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--frost-2)', textDecoration: 'none' }}>GitHub</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
