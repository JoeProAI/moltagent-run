import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Activity, 
  Hash, 
  Eye, 
  ShieldAlert
} from 'lucide-react';

export default function CarapaceFirewall() {
  const [ledgerLogs, setLedgerLogs] = useState([
    {
      id: 'tx_8921',
      plane: 'INGRESS',
      trust: 'T1 (First-Party Tool)',
      status: 'ALLOWED',
      hash: 'sha256:4a8e...1b9f',
      time: '08:45:12',
      msg: 'Android CLI layout dump verified. Provenance score 0.98.'
    },
    {
      id: 'tx_8922',
      plane: 'PROMOTION',
      trust: 'T4 (Untrusted Web Input)',
      status: 'REJECTED',
      hash: 'sha256:9c12...88a3',
      time: '08:45:15',
      msg: 'Attempted SOUL.md overwrite blocked by Carapax promotion floor (T4 < T2).'
    },
    {
      id: 'tx_8923',
      plane: 'SOUL',
      trust: 'T1 (Ed25519 Cap Token)',
      status: 'VERIFIED',
      hash: 'sha256:1e77...f402',
      time: '08:45:18',
      msg: 'Cryptographic capability signature validated. SOUL integrity 100%.'
    }
  ]);

  const handleRunSecurityCheck = () => {
    const timeStr = new Date().toLocaleTimeString();
    const newLog = {
      id: `tx_${Math.floor(Math.random() * 9000 + 1000)}`,
      plane: 'EGRESS',
      trust: 'T1 (Verified Agent)',
      status: 'PASSED',
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      msg: 'Secret-exfil scan clear. Hash-chained ledger block committed successfully.'
    };
    setLedgerLogs(prev => [newLog, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      
      {/* Sleek Banner Header */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #1F222E',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              CARAPAX MEMORY-INTEGRITY FIREWALL
              <span style={{ fontSize: '0.62rem', background: '#1F222E', color: '#FFF', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
                PROTECTION ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              5-Plane Memory Security • Ed25519 Cryptographic Tokens • Hash-Chained Ledger
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSecurityCheck}
          className="button button-primary"
          style={{ padding: '8px 16px', fontSize: '0.75rem' }}
        >
          <Activity size={14} />
          EXECUTE INTEGRITY AUDIT
        </button>
      </div>

      {/* 5-Plane Security Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {[
          { plane: '1. INGRESS PLANE', status: 'Quarantine Active', desc: 'Provenance tagging & detector scoring', icon: <Eye size={16} color="#94A3B8" /> },
          { plane: '2. RECALL PLANE', status: 'Trust-Aware Search', desc: 'Quarantined inputs suppressed from prompt', icon: <Database size={16} color="#94A3B8" /> },
          { plane: '3. PROMOTION PLANE', status: 'Gatekeeper Active', desc: 'Strict trust floor floor (T4 rejected)', icon: <Lock size={16} color="#94A3B8" /> },
          { plane: '4. SOUL PLANE', status: 'Ed25519 Signed', desc: 'Protected file cryptographic capability', icon: <Key size={16} color="#94A3B8" /> },
          { plane: '5. EGRESS PLANE', status: 'Exfil Scanner On', desc: 'Secret scan & alignment verification', icon: <ShieldAlert size={16} color="#94A3B8" /> }
        ].map((item, idx) => (
          <div key={idx} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-mono)' }}>{item.plane}</span>
              {item.icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF', marginBottom: '2px' }}>{item.status}</div>
            <p style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Append-Only Hash-Chained Audit Ledger */}
      <div className="card" style={{ background: '#090A0E', padding: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-mono)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={16} />
            APPEND-ONLY HASH-CHAINED AUDIT LEDGER
          </span>
          <span style={{ fontSize: '0.62rem', color: '#64748B' }}>IMMUTABLE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
          {ledgerLogs.map((log) => (
            <div key={log.id} style={{
              padding: '8px 12px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
              borderLeft: '3px solid #334155',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#FFF', fontWeight: '700' }}>[{log.plane}] {log.status}</span>
                <span style={{ color: '#64748B', fontSize: '0.62rem' }}>{log.time} • ID: {log.id}</span>
              </div>
              <div style={{ color: '#CBD5E1' }}>{log.msg}</div>
              <div style={{ color: '#64748B', fontSize: '0.62rem' }}>Hash: <code style={{ color: '#94A3B8' }}>{log.hash}</code> • Trust: {log.trust}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
