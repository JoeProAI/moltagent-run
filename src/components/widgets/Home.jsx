import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, ExternalLink, MessageSquareText, PenLine, Server, ShieldCheck } from 'lucide-react';

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

  const tools = [
    {
      id: 'mecha-run',
      icon: <MessageSquareText size={17} />,
      name: 'Decision cell',
      body: 'Four Grok roles plan, research, attack, and decide an engineering task.',
      cta: 'Open Debate',
      available: Boolean(status?.grok),
    },
    {
      id: 'x-growth',
      icon: <PenLine size={17} />,
      name: 'Signals studio',
      body: 'Draft and rank X hooks, then turn a strong idea into a working thread.',
      cta: 'Open Signals',
      available: Boolean(status?.grok || status?.claude),
    },
  ];

  return (
    <div className="module outpost-command">
      <section className="outpost-command-hero">
        <div className="outpost-command-copy">
          <div className="masthead-eyebrow">MOLTAGENT.RUN · OUTPOSTS CONTROL ROOM</div>
          <h1>Give Devin a place to work that you can inspect.</h1>
          <p>
            MoltAgent makes the execution boundary visible. Devin runs the agent loop.
            Daytona supplies a clean, disposable runtime. You see what exists, how long it
            can live, and when policy removes it.
          </p>
          <div className="outpost-command-actions">
            <button type="button" className="btn primary" onClick={() => onNavigate('guide')}>
              <BookOpen size={14} /> Read the Outposts guide
            </button>
            <button type="button" className="btn quiet" onClick={() => onNavigate('bridge')}>
              Inspect the control room <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <aside className="outpost-proof-card" aria-label="Validated Outposts proof">
          <div className="outpost-proof-top">
            <span>VALIDATED PRIVATE PATH</span>
            <span className="outpost-proof-dot">LIVE PROOF</span>
          </div>
          <div className="outpost-proof-id">OUTPOST / 01</div>
          <dl>
            <div><dt>SNAPSHOT</dt><dd>moltagent-devin-outpost-v1</dd></div>
            <div><dt>DESKTOP</dt><dd>Computer Use verified</dd></div>
            <div><dt>IDLE STOP</dt><dd>10 minutes</dd></div>
            <div><dt>DELETION</dt><dd>60 minutes or manual</dd></div>
          </dl>
          <p>First runtime launched, inspected, stopped by policy, then independently deleted through the ledger.</p>
        </aside>
      </section>

      <section className="outpost-boundary" aria-label="How an Outpost works">
        <div className="outpost-boundary-head">
          <div>
            <div className="masthead-eyebrow">THE EXECUTION BOUNDARY</div>
            <h2>Reasoning stays with Devin. Execution lands in an Outpost.</h2>
          </div>
          <p>An Outpost is not a second chatbot. It is the controlled environment where an agent can use a real computer without starting inside your personal workspace.</p>
        </div>
        <ol className="outpost-boundary-rail">
          <li>
            <span className="outpost-stage-number">01</span>
            <h3>Devin receives work</h3>
            <p>The agent loop reasons over the task and maintains the session.</p>
            <small>AGENT + ACUs</small>
          </li>
          <li>
            <span className="outpost-stage-number">02</span>
            <h3>Outpost claims it</h3>
            <p>The local orchestrator watches the approved queue and requests an execution runtime.</p>
            <small>QUEUE + POLICY</small>
          </li>
          <li>
            <span className="outpost-stage-number">03</span>
            <h3>Daytona executes</h3>
            <p>A clean snapshot becomes a disposable desktop, shell, browser, and filesystem.</p>
            <small>RUNTIME + COMPUTER USE</small>
          </li>
          <li>
            <span className="outpost-stage-number">04</span>
            <h3>Policy cleans up</h3>
            <p>Every runtime is visible in a ledger and stops or deletes on a bounded lifecycle.</p>
            <small>STOP + DELETE</small>
          </li>
        </ol>
      </section>

      <section className="outpost-access-grid" aria-label="Ways to use MoltAgent Outposts">
        <article className="outpost-access-card outpost-access-card-primary">
          <div className="outpost-access-kicker"><ShieldCheck size={15} /> HOSTED OUTPOSTS</div>
          <h2>Managed access, earned deliberately.</h2>
          <p>Hosted access is in private validation. Trusted guests will receive a named, time-bound runtime without receiving JoePro infrastructure credentials.</p>
          <button type="button" className="btn primary" onClick={() => onNavigate('bridge')}>
            See hosted access status <ArrowRight size={14} />
          </button>
        </article>
        <article className="outpost-access-card">
          <div className="outpost-access-kicker"><Server size={15} /> BYO OUTPOST</div>
          <h2>Your org. Your billing. Your boundary.</h2>
          <p>Teams can use the same Devin + Daytona model inside their own organization. MoltAgent explains the architecture while their environment remains theirs.</p>
          <a className="btn quiet" href="https://www.daytona.io/docs/en/guides/devin/devin-outposts/" target="_blank" rel="noreferrer">
            Open Daytona guide <ExternalLink size={14} />
          </a>
        </article>
      </section>

      <section className="outpost-secondary-tools" aria-label="Other MoltAgent tools">
        <div className="outpost-secondary-head">
          <div className="masthead-eyebrow">OTHER CELLS</div>
          <p>Outposts are the core. These tools support the work around them.</p>
        </div>
        <div className="outpost-secondary-grid">
          {tools.map(tool => (
            <article key={tool.id} className="outpost-secondary-card">
              <div className="outpost-secondary-card-head">
                <span>{tool.icon}</span>
                <span className={`badge ${tool.available ? 'ok' : ''}`}>{tool.available ? 'Configured' : 'Not configured'}</span>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.body}</p>
              <button type="button" className="btn quiet" onClick={() => onNavigate(tool.id)}>
                {tool.cta} <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
