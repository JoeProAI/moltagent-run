import React from 'react';
import { Cpu, Cloud, ShieldCheck, UserCheck } from 'lucide-react';

export default function TopBar({ daytonaCredits, activeNodes }) {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  return (
    <div className="topbar">
      {/* Real Live System Metrics */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1F222E',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Cpu size={14} color="#94A3B8" />
          <span style={{ color: '#64748B' }}>GPU CORE:</span>
          <span style={{ color: '#FFF', fontWeight: '600' }}>
            {isLocalHost ? 'RTX 5080 (LOCAL HOST)' : 'CLOUD INFERENCE (VERTEX / DAYTONA)'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1F222E',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Cloud size={14} color="#94A3B8" />
          <span style={{ color: '#64748B' }}>SWARM STATUS:</span>
          <span style={{ color: '#FFF', fontWeight: '600' }}>
            {activeNodes > 0 ? `${activeNodes} AGENTS ACTIVE` : 'READY TO DISPATCH'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1F222E',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <ShieldCheck size={14} color="#94A3B8" />
          <span style={{ color: '#64748B' }}>CARAPAX FIREWALL:</span>
          <span style={{ color: '#FFF', fontWeight: '600' }}>5-PLANE SECURE</span>
        </div>
      </div>

      {/* User Profile & Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid #1F222E',
          padding: '6px 12px',
          borderRadius: '6px'
        }}>
          <UserCheck size={16} color="#FFF" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#FFF' }}>JP (JoePro AI)</span>
            <span style={{ fontSize: '0.58rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>PRO SWARM • MOLTAGENT.RUN</span>
          </div>
        </div>

        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#1F222E',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          color: '#FFF',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem'
        }}>
          JP
        </div>
      </div>
    </div>
  );
}
