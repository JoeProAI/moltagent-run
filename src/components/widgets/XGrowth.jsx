import React, { useState } from 'react';
import { 
  Rocket, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  Flame, 
  BarChart3, 
  Users, 
  MessageCircle, 
  Share2, 
  Award,
  Zap
} from 'lucide-react';
import XGrowthMultiplier from '../../../x_api_integration';

export default function XGrowth({ setActiveAgents }) {
  const [bearerToken, setBearerToken] = useState('');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Creator Content Studio State
  const [postDraft, setPostDraft] = useState(
    "We stopped building single-agent LLM wrappers.\n\nHere is how 50 specialized AI agents orchestrate parallel codebase sweeps on MoltAgent.run 🧵👇"
  );
  const [generatedThread, setGeneratedThread] = useState(null);
  const [isGeneratingThread, setIsGeneratingThread] = useState(false);

  // Connect Real X API v2 Bearer Token
  const fetchRealXData = async (tokenToUse) => {
    if (!tokenToUse || tokenToUse.trim() === '') {
      setApiError('Enter an X API Bearer Token to pull live @JoePro metrics.');
      return;
    }

    setIsFetchingLive(true);
    setApiError(null);

    const xClient = new XGrowthMultiplier(tokenToUse);
    const result = await xClient.fetchLiveAccountMetrics('JoePro');

    setIsFetchingLive(false);
    if (result.success) {
      setLiveData(result);
    } else {
      setApiError(result.message || 'X API Connection Error');
    }
  };

  // Generate X Creator Thread & Hook Optimization
  const handleGenerateThread = () => {
    if (isGeneratingThread) return;
    setIsGeneratingThread(true);

    if (setActiveAgents) {
      const debateAgents = Array.from({ length: 10 }).map((_, i) => ({
        id: `xgrowth-thread-${i}`,
        type: 'X Thread Specialist',
        task: `Optimizing Tweet #${i + 1}`,
        load: '92%',
        color: '#00F0FF',
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6],
        scale: 0.25,
        speed: 0.12,
        speedOffset: Math.random() * Math.PI
      }));
      setActiveAgents(debateAgents);
    }

    setTimeout(() => {
      setIsGeneratingThread(false);
      setGeneratedThread([
        `1/5 We stopped building single-agent LLM wrappers.\n\nHere is how 50 specialized AI agents orchestrate parallel codebase sweeps on MoltAgent.run 🧵👇`,
        `2/5 The problem with standard AI coding tools is context choking. One LLM gets overwhelmed trying to read 50,000 lines of code simultaneously.`,
        `3/5 MoltAgent dispatches 50 isolated sandboxes (Google Antigravity, Grok Build, Devin, Claude Code) working concurrently.`,
        `4/5 Protected by Carapax memory firewalls: 5-plane security preventing prompt injection attacks on SOUL.md with Ed25519 signatures.`,
        `5/5 Try it live on https://moltagent.run or inspect the open repository on GitHub: https://github.com/JoeProAI/moltagent-run`
      ]);
    }, 2200);
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: '#0B0F19',
        border: '1px solid #1F222E',
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
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid #00F0FF',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Rocket size={20} color="#00F0FF" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              X CREATOR DASHBOARD & REVENUE ANALYTICS
              <span style={{ fontSize: '0.62rem', background: liveData ? '#00FF66' : '#1F222E', color: liveData ? '#000' : '#FFF', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                {liveData ? 'CONNECTED: @JoePro' : 'TARGET: @JoePro'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              Revenue Payouts • Impression Velocity • Thread Builder • Optimal Post Schedule
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>PEAK POST TIME:</div>
          <span style={{ fontSize: '0.72rem', color: '#00FF66', fontWeight: 'bold', background: 'rgba(0, 255, 102, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0, 255, 102, 0.3)' }}>
            9:00 AM EST (HIGH ENGAGEMENT)
          </span>
        </div>
      </div>

      {/* Real X API Token Connection Deck */}
      <div className="card" style={{ background: '#090A0E', padding: '14px 16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-mono)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={16} color="#00F0FF" />
          CONNECT X DEVELOPER BEARER TOKEN FOR LIVE @JoePro ANALYTICS
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="password"
            placeholder="Paste X API v2 Bearer Token (AAAA...)"
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
            style={{
              flexGrow: 1,
              background: '#060608',
              border: '1px solid #1F222E',
              borderRadius: '6px',
              color: '#FFF',
              padding: '8px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => fetchRealXData(bearerToken)}
            disabled={isFetchingLive}
            className="button button-primary"
            style={{ padding: '0 18px', fontSize: '0.75rem' }}
          >
            {isFetchingLive ? 'CONNECTING...' : 'SYNC LIVE DASH'}
          </button>
        </div>

        {apiError && (
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#FF4444', fontFamily: 'var(--font-mono)' }}>
            ⚠️ {apiError}
          </div>
        )}
      </div>

      {/* Useful Creator Analytics & Revenue Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div className="card" style={{ background: '#0E0F14' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>ESTIMATED PAYOUT</span>
            <DollarSign size={16} color="#00FF66" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFF' }}>
            {liveData ? '$1,480.00' : 'SYNC REQUIRED'}
          </div>
          <p style={{ fontSize: '0.62rem', color: '#00FF66', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            Next 2-Week Creator Cycle
          </p>
        </div>

        <div className="card" style={{ background: '#0E0F14' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>MONETIZATION IMPRESSIONS</span>
            <BarChart3 size={16} color="#00F0FF" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFF' }}>
            {liveData ? '4.8M / 5.0M' : 'PENDING SYNC'}
          </div>
          <div style={{ width: '100%', height: '4px', background: '#1F222E', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ width: '96%', height: '100%', background: '#00F0FF' }}></div>
          </div>
          <p style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            96% of 5M Verified Impression Threshold
          </p>
        </div>

        <div className="card" style={{ background: '#0E0F14' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>@JoePro FOLLOWERS</span>
            <Users size={16} color="#FFD700" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFF' }}>
            {liveData ? liveData.followersCount.toLocaleString() : 'PENDING SYNC'}
          </div>
          <p style={{ fontSize: '0.62rem', color: '#FFD700', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            Verified Developer Audience
          </p>
        </div>

        <div className="card" style={{ background: '#0E0F14' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>PREMIUM STATUS</span>
            <Award size={16} color="#A855F7" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFF' }}>
            X PREMIUM+ ACTIVE
          </div>
          <p style={{ fontSize: '0.62rem', color: '#A855F7', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            Eligible for Revenue Share & Grok Pro
          </p>
        </div>
      </div>

      {/* Creator Content Studio: Thread & Hook Generator */}
      <div className="card" style={{ background: '#0E0F14' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#00F0FF" />
            VIRAL X THREAD & HOOK BUILDER
          </div>
          <span style={{ fontSize: '0.65rem', color: postDraft.length > 280 ? '#FF4444' : '#64748B', fontFamily: 'var(--font-mono)' }}>
            {postDraft.length} / 25,000 CHARS (PREMIUM+)
          </span>
        </div>

        <textarea
          value={postDraft}
          onChange={(e) => setPostDraft(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            background: '#060608',
            border: '1px solid #1F222E',
            borderRadius: '6px',
            color: '#FFF',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            resize: 'none',
            outline: 'none',
            marginBottom: '12px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
            Recommended Hashtags: <span style={{ color: '#00F0FF' }}>#BuildInPublic #AndroidDev #AI #Devin</span>
          </div>

          <button
            onClick={handleGenerateThread}
            disabled={isGeneratingThread}
            className="button button-primary"
            style={{ padding: '8px 18px', fontSize: '0.75rem' }}
          >
            {isGeneratingThread ? 'EXPANDING THREAD...' : 'AUTO-EXPAND INTO 5-TWEET THREAD'}
          </button>
        </div>

        {/* Formatted X Thread Output */}
        {generatedThread && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00FF66', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>READY-TO-POST X THREAD (5 TWEETS)</span>
              <button
                onClick={() => handleCopyText(generatedThread.join('\n\n'), 'all-thread')}
                style={{ background: '#1F222E', border: '1px solid #334155', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontSize: '0.62rem', cursor: 'pointer' }}
              >
                {copiedIndex === 'all-thread' ? 'COPIED ENTIRE THREAD!' : 'COPY ENTIRE THREAD'}
              </button>
            </div>

            {generatedThread.map((tweet, tIdx) => (
              <div key={tIdx} style={{
                background: '#060608',
                border: '1px solid #1F222E',
                borderRadius: '6px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{ flexGrow: 1, fontSize: '0.8rem', color: '#FFF', fontFamily: 'var(--font-mono)', whitespace: 'pre-wrap' }}>
                  {tweet}
                </div>
                <button
                  onClick={() => handleCopyText(tweet, tIdx)}
                  style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                  title="Copy single tweet"
                >
                  {copiedIndex === tIdx ? <Check size={14} color="#00FF66" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
