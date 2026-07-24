import React from 'react';
import { Network, Rocket, Layers, Smartphone, Zap, Activity, Database, Settings } from 'lucide-react';

export default function Sidebar({ activeWidget, setActiveWidget, setConstellation, isSynced }) {
  const menuItems = [
    { id: 'android-studio', icon: <Smartphone size={18} strokeWidth={1.5} />, label: 'ANDROID SWARM', mode: 'android-party' },
    { id: 'mecha-run', icon: <Zap size={18} strokeWidth={1.5} />, label: 'M.E.C.H.A. RUN', mode: 'mecha-party' },
    { id: 'factory', icon: <Network size={18} strokeWidth={1.5} />, label: 'AGENT FACTORY', mode: 'cinematic' },
    { id: 'x-growth', icon: <Rocket size={18} strokeWidth={1.5} />, label: 'X MULTIPLIER', mode: 'x-growth' },
    { id: 'bridge', icon: <Layers size={18} strokeWidth={1.5} />, label: 'HYBRID BRIDGE', mode: 'research' },
  ];

  const handleNavClick = (id, mode) => {
    setActiveWidget(id);
    setConstellation(mode);
  };

  return (
    <div className="sidebar">
      <div>
        <h1 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '0.15em', color: '#00F0FF' }}>
          <div style={{ width: '10px', height: '10px', background: '#00F0FF', boxShadow: '0 0 10px #00F0FF' }} />
          MOLTAGENT.RUN
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.62rem', marginTop: '8px', letterSpacing: '0.2em', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
          Multi-Agent Swarm Studio
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', marginBottom: '16px' }}>MODULES</p>
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeWidget === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id, item.mode)}
            style={{ fontWeight: activeWidget === item.id ? '500' : '300' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', marginBottom: '16px' }}>SYSTEM</p>
          <div className="nav-item">
            <Activity size={18} strokeWidth={1.5} />
            <span>LOCAL SYNC (NOESIS)</span>
            <div className={`status-dot ${isSynced ? 'syncing' : ''}`} style={{ marginLeft: 'auto' }}></div>
          </div>
          <div className="nav-item">
            <Database size={18} strokeWidth={1.5} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>OPENCLAW BRAIN</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Read-First Memory Truth</span>
            </div>
          </div>
          <div className="nav-item">
            <Settings size={18} strokeWidth={1.5} />
            <span>GRAVITY RULES</span>
          </div>
        </nav>
      </div>
    </div>
  );
}
