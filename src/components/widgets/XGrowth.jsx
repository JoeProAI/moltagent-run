import React, { useState } from 'react';
import { Rocket, TrendingUp, Users, Loader } from 'lucide-react';
import { db, doc, collection, writeBatch, getDocs } from '../../firebase';

export default function XGrowth({ firebaseError, setActiveAgents }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    if (firebaseError) {
      // Degraded simulation
      const debateAgents = Array.from({ length: 25 }).map((_, i) => ({
        id: `xgrowth-debate-${i}`,
        swarmId: 'xgrowth',
        type: 'Simulation',
        task: `A/B testing variant ${i}`,
        load: Math.floor(Math.random() * 20) + 5 + '%',
        color: '#F0F4F8',
        position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
        scale: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.4 + 0.2,
        speedOffset: Math.random() * Math.PI * 2,
      }));
      setActiveAgents(current => [...current, ...debateAgents]);
      
      setTimeout(() => {
        setIsGenerating(false);
        setActiveAgents(current => current.filter(a => a.swarmId !== 'xgrowth'));
        setResult("PACKAGE READY: 1 MAIN (92% HOOK RETENTION) + 2 SUPPORT THREADS.");
      }, 4000);
      return;
    }

    try {
      const batch = writeBatch(db);
      
      // Create 25 debate agents in DB
      for(let i=0; i<25; i++) {
        const agentId = `xgrowth-debate-${i}`;
        const agentRef = doc(db, "activeAgents", agentId);
        batch.set(agentRef, {
          swarmId: 'xgrowth',
          type: 'Simulation',
          task: `A/B testing variant ${i}`,
          load: Math.floor(Math.random() * 20) + 5 + '%',
          color: '#F0F4F8',
          position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
          scale: Math.random() * 0.1 + 0.05,
          speed: Math.random() * 0.4 + 0.2,
          speedOffset: Math.random() * Math.PI * 2,
        });
      }
      await batch.commit();

      // Simulate the processing time of the swarm
      setTimeout(async () => {
        const cleanupBatch = writeBatch(db);
        const querySnapshot = await getDocs(collection(db, "activeAgents"));
        querySnapshot.forEach((document) => {
          if (document.data().swarmId === 'xgrowth') {
            cleanupBatch.delete(doc(db, "activeAgents", document.id));
          }
        });
        await cleanupBatch.commit();
        setIsGenerating(false);
        setResult("PACKAGE READY: 1 MAIN (92% HOOK RETENTION) + 2 SUPPORT THREADS.");
      }, 4000);
      
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="widget-header">
        <h2 className="widget-title">
          <Rocket size={20} color="#D4AF37" />
          X GROWTH MULTIPLIER
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '24px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
          <TrendingUp size={20} color="#D4AF37" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: '300', fontFamily: 'JetBrains Mono' }}>+4.2M</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Impressions (48h)</div>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '24px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
          <Users size={20} color="#D4AF37" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: '300', fontFamily: 'JetBrains Mono' }}>+12k</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Follower Delta</div>
        </div>
      </div>

      <h3 style={{ fontSize: '0.8rem', marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simulation Engine</h3>
      
      <div className="agent-card" style={{ borderLeft: '1px solid var(--text-main)', paddingLeft: '16px' }}>
        <div>
          <h4 style={{ margin: 0, marginBottom: '8px', fontSize: '0.9rem', fontWeight: '400' }}>A/B Debate (25 Variants)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, fontFamily: 'JetBrains Mono' }}>
            Analyzing highest-signal thread format for upcoming launch.
          </p>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: '300', fontFamily: 'JetBrains Mono' }}>82%</div>
      </div>
      
      {result && (
        <div style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--border-glass)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
          {result}
        </div>
      )}
      
      <button 
        className="glass-button primary" 
        style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? <><Loader className="floating" size={16} /> SIMULATING DB SWARM...</> : 'GENERATE NEXT 48H PACKAGE'}
      </button>
    </div>
  );
}
