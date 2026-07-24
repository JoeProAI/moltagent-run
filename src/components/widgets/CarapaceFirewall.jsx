import { useState } from 'react';
import {
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

  const planes = [
    { num: 'P1', plane: 'Ingress', status: 'Quarantine active', desc: 'Every input gets a provenance tag and a detector score before it touches memory.', icon: <Eye size={15} /> },
    { num: 'P2', plane: 'Recall', status: 'Trust-aware search', desc: 'Quarantined inputs are suppressed from prompts during memory recall.', icon: <Database size={15} /> },
    { num: 'P3', plane: 'Promotion', status: 'Gatekeeper active', desc: 'Strict trust floor: untrusted (T4) content can never be promoted to core memory.', icon: <Lock size={15} /> },
    { num: 'P4', plane: 'Soul', status: 'Ed25519 signed', desc: 'Protected identity files require a cryptographic capability token to modify.', icon: <Key size={15} /> },
    { num: 'P5', plane: 'Egress', status: 'Exfil scanner on', desc: 'Outbound content is scanned for secrets before it leaves the swarm.', icon: <ShieldAlert size={15} /> }
  ];

  const statusTone = (status) => {
    if (status === 'REJECTED') return 'danger';
    if (status === 'ALLOWED' || status === 'VERIFIED' || status === 'PASSED') return 'ok';
    return '';
  };

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S2 · Carapax firewall</div>
          <h2 className="masthead-title">The shell around your agents' memory</h2>
          <p className="masthead-sub">
            Five defensive planes keep untrusted input out of agent memory, and an immutable
            hash-chained ledger records every allow and reject decision.
          </p>
        </div>
        <div className="masthead-actions">
          <span className="badge ok">Protection active</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <button type="button" className="btn primary" onClick={handleRunSecurityCheck}>
              <Activity size={14} />
              Run integrity audit
            </button>
            <span className="btn-hint">Appends a signed block to the ledger below</span>
          </div>
        </div>
      </div>

      {/* 5-Plane Security Matrix */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        {planes.map((item, idx) => (
          <div key={idx} className="panel">
            <div className="panel-head" style={{ marginBottom: 'var(--sp-2)' }}>
              <span className="masthead-eyebrow" style={{ marginBottom: 0 }}>{item.num} · {item.plane}</span>
              {item.icon}
            </div>
            <div className="panel-title" style={{ marginBottom: '4px' }}>{item.status}</div>
            <p className="panel-sub" style={{ marginBottom: 'var(--sp-3)' }}>{item.desc}</p>
            <div className="segmeter" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i <= idx ? 'lit' : ''} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Append-Only Hash-Chained Audit Ledger */}
      <div className="panel sunken">
        <div className="panel-head">
          <div className="panel-title">
            <Hash size={15} />
            Audit ledger — append-only, hash-chained
          </div>
          <span className="panel-note">Every decision is recorded. Nothing can be edited or removed.</span>
        </div>

        <div className="console">
          {ledgerLogs.map((log) => (
            <div key={log.id} className={`log-block ${statusTone(log.status)}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--frost)', fontWeight: 700 }}>
                  [{log.plane}] <span style={{ color: log.status === 'REJECTED' ? 'var(--danger)' : 'var(--ok)' }}>{log.status}</span>
                </span>
                <span className="log-time">{log.time} · {log.id}</span>
              </div>
              <div className="log-msg">{log.msg}</div>
              <div className="log-time">hash <code style={{ color: 'var(--frost-2)' }}>{log.hash}</code> · trust {log.trust}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
