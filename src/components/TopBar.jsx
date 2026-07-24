import React from 'react';
import { Cpu, Cloud, ShieldCheck, UserCheck, Terminal, Zap } from 'lucide-react';

export default function TopBar({ daytonaCredits, activeNodes }) {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  return (
    <div className="topbar" style={{
      background: 'rgba(10, 10, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Real Live System Metrics */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="stat-pill" title={isLocalHost ? "Local Host RTX 5080 Hardware Acceleration" : "Cloud Distributed Inference Outpost"}>
          <Cpu size={14} color="#00F0FF" />
          <span style={{ fontSize: '0.65rem', color: '#AAA', fontFamily: 'JetBrains Mono' }}>GPU CORE:</span>
          <span className="stat-value" style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '0.7rem' }}>
            {isLocalHost ? 'RTX 5080 (LOCAL HOST)' : 'CLOUD INFERENCE (VERTEX / DAYTONA)'}
          </span>
        </div>

        <div className="stat-pill" title="Google Antigravity & Vertex AI Subagent Swarm Status">
          <Cloud size={14} color="#00FF66" />
          <span style={{ fontSize: '0.65rem', color: '#AAA', fontFamily: 'JetBrains Mono' }}>SWARM STATUS:</span>
          <span className="stat-value" style={{ color: '#00FF66', fontWeight: 'bold', fontSize: '0.7rem' }}>
            {activeNodes > 0 ? `${activeNodes} AGENTS ACTIVE` : 'READY TO DISPATCH'}
          </span>
        </div>

        <div className="stat-pill" title="Carapax Memory Integrity Firewall Protection">
          <ShieldCheck size={14} color="#A855F7" />
          <span style={{ fontSize: '0.65rem', color: '#AAA', fontFamily: 'JetBrains Mono' }}>CARAPAX FIREWALL:</span>
          <span className="stat-value" style={{ color: '#A855F7', fontWeight: 'bold', fontSize: '0.7rem' }}>5-PLANE SECURE</span>
        </div>
      </div>

      {/* User Profile & Actions */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          padding: '6px 14px',
          borderRadius: '6px'
        }}>
          <UserCheck size={16} color="#00F0FF" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#FFF' }}>JP (JoePro AI)</span>
            <span style={{ fontSize: '0.55rem', color: '#00FF66', fontFamily: 'JetBrains Mono' }}>PRO SWARM • MOLTAGENT.RUN</span>
          </div>
        </div>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00F0FF 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#000',
          fontFamily: 'JetBrains Mono',
          fontSize: '0.85rem',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)'
        }}>
          JP
        </div>
      </div>
    </div>
  );
}
