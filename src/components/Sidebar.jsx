import React from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  Network, 
  Rocket, 
  Layers, 
  Activity, 
  Database, 
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeWidget, setActiveWidget, setConstellation, isSynced }) {
  const menuItems = [
    { id: 'android-studio', icon: <Smartphone size={16} />, label: 'ANDROID SWARM', mode: 'android-party' },
    { id: 'carapace-firewall', icon: <ShieldCheck size={16} />, label: 'CARAPAX FIREWALL', mode: 'carapace-sec' },
    { id: 'mecha-run', icon: <Zap size={16} />, label: 'M.E.C.H.A. RUN', mode: 'mecha-party' },
    { id: 'factory', icon: <Network size={16} />, label: 'AGENT FACTORY', mode: 'cinematic' },
    { id: 'x-growth', icon: <Rocket size={16} />, label: 'X MULTIPLIER', mode: 'x-growth' },
    { id: 'bridge', icon: <Layers size={16} />, label: 'HYBRID BRIDGE', mode: 'research' },
  ];

  const handleNavClick = (id, mode) => {
    setActiveWidget(id);
    setConstellation(mode);
  };

  return (
    <div className="sidebar">
      {/* Brand Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '2px',
            background: 'var(--color-cyan)',
            boxShadow: '0 0 10px var(--color-cyan)'
          }} />
          <h1 style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            color: '#FFF',
            letterSpacing: '-0.02em'
          }}>
            MOLTAGENT.RUN
          </h1>
        </div>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.62rem',
          marginTop: '4px',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Multi-Agent Swarm Studio
        </p>
      </div>

      {/* Navigation Modules */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.6rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          fontWeight: '700'
        }}>
          STUDIO MODULES
        </p>
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeWidget === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id, item.mode)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-mono)' }}>MEMORY TRUTH</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)', boxShadow: '0 0 6px var(--color-emerald)' }}></span>
          </div>
          <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>NOESIS & gBrain Vector Vault Synchronized</p>
        </div>
      </div>
    </div>
  );
}
