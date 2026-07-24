import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Zap,
  BarChart2,
  Share2,
  Sparkles,
  Key,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import XGrowthMultiplier from '../../../x_api_integration';

export default function XGrowth({ setActiveAgents }) {
  const [bearerToken, setBearerToken] = useState('');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [apiError, setApiError] = useState(null);

  const [topicInput, setTopicInput] = useState('Why multi-agent coding swarms render single LLM frameworks obsolete');
  const [isSimulating, setIsSimulating] = useState(false);
  const [winningHook, setWinningHook] = useState(null);

  // Thread builder
  const [postDraft, setPostDraft] = useState(
    'We stopped building single-agent LLM wrappers. Here is how 50 specialized AI agents orchestrate parallel codebase sweeps on MoltAgent.run:'
  );
  const [generatedThread, setGeneratedThread] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleExpandThread = async () => {
    if (isExpanding) return;
    setIsExpanding(true);

    const xClient = new XGrowthMultiplier();
    const result = await xClient.expandThread(postDraft);

    setIsExpanding(false);
    if (result.success && result.tweets?.length) {
      setGeneratedThread({ tweets: result.tweets, live: true, note: 'Live generation' });
    } else {
      setGeneratedThread({
        live: false,
        note: `Simulated — ${result.message || 'thread API unavailable'}`,
        tweets: [
          '1/5 We stopped building single-agent LLM wrappers. Here is how 50 specialized AI agents orchestrate parallel codebase sweeps on MoltAgent.run:',
          '2/5 The problem with standard AI coding tools is context choking. One LLM gets overwhelmed trying to read 50,000 lines of code simultaneously.',
          '3/5 MoltAgent dispatches 50 isolated sandboxes (Antigravity, Grok Build, Devin, Claude Code) working concurrently on the same repo.',
          '4/5 Memory stays clean behind the Carapax firewall: 5 security planes, trust floors, Ed25519-signed identity files.',
          '5/5 Try it live at https://moltagent.run or read the code at https://github.com/JoeProAI/moltagent-run'
        ]
      });
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Attempt live X API fetch when bearer token is entered
  const fetchRealXData = async (tokenToUse) => {
    if (!tokenToUse || tokenToUse.trim() === '') {
      setApiError('X API Bearer Token required to fetch live @JoePro account stats.');
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

  const handleRunDebateSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    if (setActiveAgents) {
      const debateAgents = Array.from({ length: 15 }).map((_, i) => ({
        id: `xgrowth-variant-${i}`,
        type: 'X A/B Tester',
        task: `Testing Hook #${i + 1}`,
        load: '95%',
        color: '#E8A832',
        position: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
        scale: 0.25,
        speed: 0.15,
        speedOffset: Math.random() * Math.PI
      }));
      setActiveAgents(debateAgents);
    }

    // Real generation via /api/generate-hooks (Claude). Falls back to a
    // canned example, clearly labeled, when the API isn't configured.
    const xClient = new XGrowthMultiplier();
    const result = await xClient.generateHooks(topicInput, 25);

    setIsSimulating(false);
    if (result.success && result.winner) {
      setWinningHook({
        text: result.winner.text,
        score: `${result.winner.retentionScore}% predicted retention`,
        viralIndex: `${result.winner.angle} · viral signal ${result.winner.viralIndex}/10`,
        runnersUp: result.hooks.slice(1, 4),
        live: true
      });
    } else {
      setWinningHook({
        text: `Stop asking one LLM a question. Walk into a room with 50 specialized agents, give them the same codebase, and collect 50 expert perspectives simultaneously. Here's how MoltAgent.run changes everything:`,
        score: '96.8% predicted retention',
        viralIndex: `Simulated — ${result.message || 'hook API unavailable'}`,
        runnersUp: [],
        live: false
      });
    }
  };

  const metrics = [
    { label: '@JoePro followers', value: liveData ? liveData.followersCount.toLocaleString() : '—', sub: liveData ? 'Live X API v2 count' : 'Connect token to sync', tone: liveData ? 'ok' : '', icon: <Users size={14} /> },
    { label: 'Total posts', value: liveData ? liveData.tweetCount.toLocaleString() : '—', sub: liveData ? 'Live published posts' : 'Connect token to sync', tone: liveData ? 'ok' : '', icon: <BarChart2 size={14} /> },
    { label: 'Following', value: liveData ? liveData.followingCount.toLocaleString() : '—', sub: liveData ? 'Live X API v2 count' : 'Connect token to sync', tone: liveData ? 'ok' : '', icon: <TrendingUp size={14} /> },
    { label: 'Public listings', value: liveData ? liveData.listedCount.toLocaleString() : '—', sub: liveData ? 'Curated dev lists' : 'Connect token to sync', tone: liveData ? 'ok' : '', icon: <Share2 size={14} /> }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S5 · X multiplier</div>
          <h2 className="masthead-title">Grow @JoePro with 25 parallel hook testers</h2>
          <p className="masthead-sub">
            Live telemetry from the official X API v2, plus an A/B engine that drafts 25 tweet-hook
            variants in parallel and surfaces the one predicted to retain readers longest.
          </p>
        </div>
        <div className="masthead-actions">
          <span className={`badge ${liveData ? 'ok' : ''}`}>{liveData ? 'Live X API connected' : 'Not connected'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <button
              type="button"
              className="btn primary"
              onClick={handleRunDebateSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
              {isSimulating ? 'Testing 25 variants…' : 'Generate 25 hook variants'}
            </button>
            <span className="btn-hint">Claude drafts and ranks hooks for your topic below</span>
          </div>
        </div>
      </div>

      {/* X API Connection */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <Key size={15} />
            Connect your X developer token
          </div>
          <span className="panel-note">Stored in memory only, never persisted</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <input
            type="password"
            className="field"
            style={{ flex: 1, minWidth: '240px' }}
            placeholder="Paste X API v2 Bearer Token (AAAA…)"
            aria-label="X API v2 Bearer Token"
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
          />
          <button
            type="button"
            className="btn"
            onClick={() => fetchRealXData(bearerToken)}
            disabled={isFetchingLive}
          >
            {isFetchingLive ? <RefreshCw size={14} className="spin" /> : <CheckCircle2 size={14} />}
            {isFetchingLive ? 'Connecting…' : 'Sync live data'}
          </button>
        </div>

        {apiError && (
          <div style={{ marginTop: 'var(--sp-3)', fontSize: '0.72rem', color: 'var(--danger)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} />
            {apiError}
          </div>
        )}
      </div>

      {/* Live Metrics */}
      <div className="grid cols-4">
        {metrics.map((stat, idx) => (
          <div key={idx} className="metric">
            <div className="metric-label">
              {stat.label}
              {stat.icon}
            </div>
            <div className="metric-value">{stat.value}</div>
            <div className={`metric-sub ${stat.tone}`}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Hook Simulator */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <Zap size={15} />
            Viral hook A/B simulator
          </div>
          <span className="panel-note">25 variants drafted and scored by Claude</span>
        </div>

        <label className="field-label" htmlFor="hook-topic">Topic to write hooks about</label>
        <textarea
          id="hook-topic"
          className="textarea"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          rows={2}
        />

        {winningHook && (
          <div className="panel sunken" style={{ marginTop: 'var(--sp-3)', borderColor: 'var(--amber)' }}>
            <div className="panel-head" style={{ marginBottom: 'var(--sp-2)' }}>
              <span className="badge hot">Winning hook · {winningHook.score}</span>
              <span className={`badge ${winningHook.live ? 'ok' : ''}`}>
                {winningHook.live ? 'Live generation' : 'Simulated'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--frost)', lineHeight: 1.5, marginBottom: 'var(--sp-2)' }}>
              "{winningHook.text}"
            </p>
            <div className={`metric-sub ${winningHook.live ? 'ok' : ''}`}>{winningHook.viralIndex}</div>

            {winningHook.runnersUp?.length > 0 && (
              <div style={{ marginTop: 'var(--sp-3)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <span className="field-label" style={{ marginBottom: 0 }}>Runners-up</span>
                {winningHook.runnersUp.map((hook, i) => (
                  <div key={i} className="log-block">
                    <span className="log-msg">"{hook.text}"</span>
                    <span className="log-time">{hook.retentionScore}% retention · {hook.angle}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thread Builder */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <MessageCircle size={15} />
            Thread builder
          </div>
          <span className="panel-note">Turns one draft into a ready-to-post 5-tweet thread</span>
        </div>

        <label className="field-label" htmlFor="thread-draft">Your draft post or idea</label>
        <textarea
          id="thread-draft"
          className="textarea"
          value={postDraft}
          onChange={(e) => setPostDraft(e.target.value)}
          rows={3}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <button
              type="button"
              className="btn primary"
              onClick={handleExpandThread}
              disabled={isExpanding}
            >
              {isExpanding ? <RefreshCw size={14} className="spin" /> : <MessageCircle size={14} />}
              {isExpanding ? 'Expanding thread…' : 'Expand into 5-tweet thread'}
            </button>
            <span className="btn-hint">Each tweet gets its own copy button</span>
          </div>
        </div>

        {generatedThread && (
          <div style={{ marginTop: 'var(--sp-3)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${generatedThread.live ? 'ok' : ''}`}>{generatedThread.note}</span>
              <button
                type="button"
                className="btn quiet"
                onClick={() => handleCopyText(generatedThread.tweets.join('\n\n'), 'all')}
              >
                {copiedIndex === 'all' ? <Check size={14} /> : <Copy size={14} />}
                {copiedIndex === 'all' ? 'Copied whole thread' : 'Copy whole thread'}
              </button>
            </div>

            {generatedThread.tweets.map((tweet, idx) => (
              <div key={idx} className="log-block" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 'var(--sp-3)', display: 'flex' }}>
                <span className="log-msg" style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{tweet}</span>
                <button
                  type="button"
                  className="btn quiet"
                  aria-label={`Copy tweet ${idx + 1}`}
                  onClick={() => handleCopyText(tweet, idx)}
                >
                  {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
