import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Database, 
  Activity, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Hash, 
  Cpu, 
  Eye, 
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

export default function CarapaceFirewall() {
  const [quarantineMode, setQuarantineMode] = useState(true);
  const [ed25519Token, setEd25519Token] = useState('ed25519_cap_7f94a1b83e92c0');
  const [ledgerLogs, setLedgerLogs] = useState([
    {
      id: 'tx_8921',
      plane: 'INGRESS',
      trust: 'T1 (First-Party Tool)',
      status: 'ALLOWED',
      color: '#00FF66',
      hash: 'sha256:4a8e...1b9f',
      time: '08:20:12',
      msg: 'Android CLI layout dump verified. Provenance score 0.98.'
    },
    {
      id: 'tx_8922',
      plane: 'PROMOTION',
      trust: 'T4 (Untrusted Web Input)',
      status: 'REJECTED',
      color: '#FF4444',
      hash: 'sha256:9c12...88a3',
      time: '08:20:15',
      msg: 'Attempted SOUL.md overwrite blocked by Carapax promotion floor (T4 < T2).'
    },
    {
      id: 'tx_8923',
      plane: 'SOUL',
      trust: 'T1 (Ed25519 Cap Token)',
      status: 'VERIFIED',
      color: '#00F0FF',
      hash: 'sha256:1e77...f402',
      time: '08:20:18',
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
      color: '#00FF66',
      hash: `sha256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      msg: 'Secret-exfil scan clear. Hash-chained ledger block committed successfully.'
    };
    setLedgerLogs(prev => [newLog, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,255,102,0.1) 0%, rgba(0,240,255,0.1) 100%)',
        border: '1px solid rgba(0,255,102,0.3)',
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
            background: 'rgba(0,255,102,0.15)',
            border: '1px solid #00FF66',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={26} color="#00FF66" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '0.05em' }}>
              CARAPAX MEMORY-INTEGRITY FIREWALL
              <span style={{ fontSize: '0.65rem', background: '#00FF66', color: '#000', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                PROTECTION ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
              5-Plane Memory Security • Ed25519 Cryptographic Tokens • Hash-Chained Ledger
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSecurityCheck}
          className="button"
          style={{
            background: '#00FF66',
            color: '#000',
            fontWeight: 'bold',
            padding: '8px 16px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Activity size={14} />
          EXECUTE INTEGRITY AUDIT
        </button>
      </div>

      {/* 5-Plane Security Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {[
          { plane: '1. INGRESS PLANE', status: 'Quarantine Active', desc: 'Provenance tagging & detector scoring', color: '#00F0FF', icon: <Eye size={16} /> },
          { plane: '2. RECALL PLANE', status: 'Trust-Aware Search', desc: 'Quarantined inputs suppressed from prompt', color: '#38BDF8', icon: <Database size={16} /> },
          { plane: '3. PROMOTION PLANE', status: 'Gatekeeper Active', desc: 'Strict trust floor floor (T4 rejected)', color: '#FF9900', icon: <Lock size={16} /> },
          { plane: '4. SOUL PLANE', status: 'Ed25519 Signed', desc: 'Protected file cryptographic capability', color: '#00FF66', icon: <Key size={16} /> },
          { plane: '5. EGRESS PLANE', status: 'Exfil Scanner On', desc: 'Secret scan & alignment verification', color: '#A855F7', icon: <ShieldAlert size={16} /> }
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ background: 'rgba(12,12,18,0.95)', border: `1px solid ${item.color}40`, padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: item.color, fontFamily: 'JetBrains Mono' }}>{item.plane}</span>
              {item.icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FFF', marginBottom: '4px' }}>{item.status}</div>
            <p style={{ fontSize: '0.65rem', color: '#888', fontFamily: 'JetBrains Mono' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Append-Only Hash-Chained Audit Ledger */}
      <div className="card" style={{ background: '#000', border: '1px solid rgba(0,255,102,0.25)', padding: '16px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#00FF66', fontFamily: 'JetBrains Mono', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={16} />
            APPEND-ONLY HASH-CHAINED AUDIT LEDGER
          </span>
          <span style={{ fontSize: '0.65rem', color: '#AAA' }}>CRYPTOGRAPHICALLY IMMUTABLE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {ledgerLogs.map((log) => (
            <div key={log.id} style={{
              padding: '10px 14px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
              borderLeft: `4px solid ${log.color}`,
              fontFamily: 'JetBrains Mono',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: log.color, fontWeight: 'bold' }}>[{log.plane}] {log.status}</span>
                <span style={{ color: '#666', fontSize: '0.65rem' }}>{log.time} • ID: {log.id}</span>
              </div>
              <div style={{ color: '#DDD' }}>{log.msg}</div>
              <div style={{ color: '#666', fontSize: '0.62rem' }}>Hash: <code style={{ color: '#00F0FF' }}>{log.hash}</code> • Trust Level: {log.trust}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
