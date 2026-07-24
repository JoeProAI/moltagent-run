import React from 'react';
import { Cpu, Cloud, Mic, Bell } from 'lucide-react';

export default function TopBar({ daytonaCredits, activeNodes }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', gap: '32px' }}>
        <div className="stat-pill">
          <Cpu size={14} color="var(--text-main)" />
          <span>RTX 5080 LOAD:</span>
          <span className="stat-value">{activeNodes > 0 ? '48%' : '12%'}</span>
        </div>
        <div className="stat-pill">
          <Cloud size={14} color="var(--text-main)" />
          <span>GCP VERTEX:</span>
          <span className="stat-value">{activeNodes > 0 ? `${activeNodes} NODES ACTIVE` : 'STANDBY'}</span>
        </div>
        <div className="stat-pill">
          <span>$</span>
          <span>DAYTONA CREDITS:</span>
          <span className="stat-value">{daytonaCredits.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <button className="glass-button" style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '0', padding: '12px' }}>
          <Mic size={16} className={activeNodes > 0 ? "floating" : ""} style={{ animationDuration: '4s' }} />
        </button>
        <button className="glass-button" style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '0', padding: '12px' }}>
          <Bell size={16} />
        </button>
        <div style={{ width: '40px', height: '40px', border: '1px solid var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '400', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
          JP
        </div>
      </div>
    </div>
  );
}
