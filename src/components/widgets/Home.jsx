import { useState, useEffect } from 'react';
import { Rocket, MessagesSquare, PenLine, FlaskConical, ArrowRight } from 'lucide-react';

// Home — the front door. Says what the site does in plain words, shows which
// tools are live (from /api/status, booleans only), and routes with one click.
export default function Home({ onNavigate }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- async fetch */
    fetch('/api/status')
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus({}));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const liveBadge = (isLive, needs) =>
    status === null
      ? <span className="badge">Checking…</span>
      : isLive
        ? <span className="badge ok">Live</span>
        : <span className="badge">Needs {needs}</span>;

  const tools = [
    {
      id: 'guide',
      icon: <Rocket size={18} />,
      name: 'Devin Outposts',
      what: 'A field manual for running Devin on Daytona infrastructure you control. Start here before launching a sandbox.',
      how: 'Learn the credentials, snapshot, runtime, and validation path.',
      badge: <span className="badge">Setup guide</span>,
      cta: 'Open the guide'
    },
    {
      id: 'mecha-run',
      icon: <MessagesSquare size={18} />,
      name: 'Debate',
      what: 'Four Grok agents argue your engineering task — one plans, one researches, one attacks it, one delivers the verdict.',
      how: 'Type a task, hit Dispatch, read the debate.',
      badge: liveBadge(status?.grok, 'XAI_API_KEY'),
      cta: 'Start a debate'
    },
    {
      id: 'x-growth',
      icon: <PenLine size={18} />,
      name: 'Studio',
      what: 'Grok drafts and ranks 25 tweet hooks for your topic, and expands a draft into a ready-to-post 5-tweet thread with copy buttons.',
      how: 'Type a topic, generate, copy what you like.',
      badge: liveBadge(status?.grok || status?.claude, 'XAI_API_KEY'),
      cta: 'Write content'
    }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">JoePro AI</div>
          <h2 className="masthead-title">Coding agents on real cloud infrastructure</h2>
          <p className="masthead-sub">
            Three working tools: launch Daytona outpost sandboxes for Devin, debate engineering
            decisions with a Grok agent crew, and generate X content that's ready to post.
            Built in public by @JoePro.
          </p>
        </div>
      </div>

      <div className="grid cols-3">
        {tools.map(tool => (
          <div key={tool.id} className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel-head">
              <div className="panel-title">
                {tool.icon}
                {tool.name}
              </div>
              {tool.badge}
            </div>
            <p className="panel-sub">{tool.what}</p>
            <p className="panel-sub" style={{ color: 'var(--frost-3)' }}>How: {tool.how}</p>
            <div style={{ marginTop: 'auto' }}>
              <button type="button" className="btn primary" style={{ width: '100%' }} onClick={() => onNavigate(tool.id)}>
                {tool.cta}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel sunken">
        <div className="panel-head" style={{ marginBottom: 'var(--sp-2)' }}>
          <div className="panel-title">
            <FlaskConical size={15} />
            The Lab
          </div>
          <span className="badge">Concept demos</span>
        </div>
        <p className="panel-sub" style={{ marginBottom: 'var(--sp-3)' }}>
          Interactive mockups of ideas in progress — a multi-platform build swarm, the Carapax
          memory firewall, and a swarm factory. Nothing in the Lab runs real compute; it's
          design exploration, clearly labeled.
        </p>
        <button type="button" className="btn quiet" onClick={() => onNavigate('lab')}>
          Browse the Lab
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
