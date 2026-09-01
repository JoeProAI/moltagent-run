import { ArrowRight, CheckCircle2, ExternalLink, KeyRound, LockKeyhole, Server, ShieldCheck, TriangleAlert, Terminal, Cpu } from 'lucide-react';
import hero from '../../assets/hero.png';

export default function OutpostGuide({ onNavigate }) {
  const steps = [
    ['01', 'Create an outpost', 'In Devin Cloud, go to Settings, Environment, Outposts and create one. Choose a name and platform (Linux, Windows, or Mac). Save the outpost token.'],
    ['02', 'Set up your machine', 'Install the Devin CLI, clone your repositories, and ensure git and any build tools are available. The machine needs outbound HTTPS only.'],
    ['03', 'Start the worker', 'Run devin worker start --outpost=<name> --token=<token>. The worker watches the queue and claims sessions as they arrive.'],
    ['04', 'Dispatch a session', 'Start a Devin session targeting your outpost. The worker claims it and executes tool calls locally while Devin handles reasoning.'],
  ];

  const partners = [
    { name: 'Daytona', desc: 'Linux and Windows sandboxes from snapshots, sub-90ms starts' },
    { name: 'Namespace', desc: 'macOS on Apple silicon with Computer Use for iOS builds' },
    { name: 'Modal', desc: 'GPU instances that scale to zero between sessions' },
    { name: 'E2B', desc: 'Agent machines at any CPU/RAM config with sub-second starts' },
    { name: 'Cloudflare', desc: 'Isolated sandboxes with private connectivity, no VPN needed' },
  ];

  return (
    <article className="module outpost-guide">
      <header className="guide-hero">
        <div className="guide-hero-copy">
          <div className="masthead-eyebrow">FIELD MANUAL · DEVIN OUTPOSTS</div>
          <h2>Put a Devin crew on infrastructure you control.</h2>
          <p>
            An Outpost gives Devin an isolated workspace on your infrastructure. Devin runs the agent loop
            and bills ACUs. Your workers supply the controlled execution surface.
          </p>
          <div className="guide-actions">
            <button type="button" className="btn primary" onClick={() => onNavigate('bridge')}>
              Check Outposts <ArrowRight size={14} />
            </button>
            <a className="btn quiet" href="https://docs.devin.ai/cloud/outposts/overview" target="_blank" rel="noreferrer">
              Devin docs <ExternalLink size={14} />
            </a>
          </div>
        </div>
        <div className="guide-signal" aria-label="Outpost architecture diagram">
          <div className="guide-signal-label">CONTROL PATH</div>
          <div className="guide-stack">
            <span>DEVIN</span>
            <i />
            <span>OUTPOST QUEUE</span>
            <i />
            <span>YOUR WORKER</span>
          </div>
          <img src={hero} alt="Layered infrastructure diagram" />
        </div>
      </header>

      <section className="guide-callout" aria-label="Current availability">
        <TriangleAlert size={18} />
        <div>
          <strong>Hosted launch is in private validation.</strong>
          <span> The hosted sandbox path requires a registered snapshot and operator verification before it opens to guests.</span>
        </div>
      </section>

      <section className="guide-grid" aria-label="How Outposts work">
        <div className="guide-panel guide-panel-primary">
          <div className="guide-kicker"><Server size={15} /> WHAT YOU GET</div>
          <h3>Isolated execution, not a second Devin.</h3>
          <ul className="guide-list">
            <li><CheckCircle2 size={15} /> Work runs on your machine, container, or cloud VM.</li>
            <li><CheckCircle2 size={15} /> N workers serve N concurrent sessions; extras wait in the queue.</li>
            <li><CheckCircle2 size={15} /> Your source code and secrets stay on your chosen infrastructure.</li>
          </ul>
        </div>
        <div className="guide-panel">
          <div className="guide-kicker"><KeyRound size={15} /> WHAT YOU NEED</div>
          <h3>An outpost token and a machine.</h3>
          <dl className="guide-credentials">
            <div><dt>Devin Outpost token</dt><dd>Created in Devin Cloud under Settings, Environment, Outposts.</dd></div>
            <div><dt>Worker machine</dt><dd>Any VM, container, or laptop with outbound HTTPS and the Devin CLI.</dd></div>
          </dl>
        </div>
        <div className="guide-panel">
          <div className="guide-kicker"><LockKeyhole size={15} /> WHAT STAYS PRIVATE</div>
          <h3>Credentials are tools, not form fields.</h3>
          <ul className="guide-list">
            <li><CheckCircle2 size={15} /> Never commit an outpost token to source control.</li>
            <li><CheckCircle2 size={15} /> Pass tokens via env vars or CLI flags, not prompts.</li>
            <li><CheckCircle2 size={15} /> Hosted tokens are injected once, never persisted.</li>
          </ul>
        </div>
      </section>

      <section className="guide-runbook">
        <div className="guide-runbook-head">
          <div>
            <div className="masthead-eyebrow">QUICKSTART</div>
            <h3>From zero to claimed session.</h3>
          </div>
          <a href="https://docs.devin.ai/cloud/outposts/quickstart" target="_blank" rel="noreferrer">
            Full quickstart guide <ExternalLink size={14} />
          </a>
        </div>
        <ol className="guide-steps">
          {steps.map(([number, title, copy]) => (
            <li key={number}>
              <span className="guide-step-number">{number}</span>
              <div><h4>{title}</h4><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide-cli" aria-label="First-party worker">
        <div className="guide-cli-head">
          <div className="masthead-eyebrow">FIRST-PARTY WORKER</div>
          <h3>The Devin CLI is all you need.</h3>
        </div>
        <div className="guide-cli-body">
          <p>Install the CLI on any machine and start the worker. It polls your outpost, claims sessions, downloads the correct binary, and executes tool calls locally.</p>
          <pre className="codeblock"><code>{`# Install the Devin CLI
curl -fsSL https://cli.devin.ai/install.sh | bash

# Start a worker
devin worker start --outpost=<outpost_name> --token=<your_token>`}</code></pre>
          <p style={{ fontSize: '0.72rem', color: 'var(--frost-2)', marginTop: 'var(--sp-2)' }}>
            <Terminal size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Workers only need outbound HTTPS. No inbound ports, public IPs, or VPN tunnels.
          </p>
        </div>
      </section>

      <section className="guide-partners" aria-label="Partner integrations">
        <div className="guide-partners-head">
          <div>
            <div className="masthead-eyebrow">PARTNER PLATFORMS</div>
            <h3>Or let a partner run the orchestration.</h3>
          </div>
          <a href="https://docs.devin.ai/cloud/outposts/overview#integrations" target="_blank" rel="noreferrer">
            View all integrations <ExternalLink size={14} />
          </a>
        </div>
        <p className="guide-partners-intro">
          Partners implement the orchestration loop for you. Sessions run on their infrastructure with no worker to manage and no orchestrator to build.
        </p>
        <ul className="guide-partners-list">
          {partners.map((p) => (
            <li key={p.name}>
              <Cpu size={14} />
              <strong>{p.name}</strong>
              <span>{p.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="guide-access-ladder" aria-label="Access roadmap">
        <div>
          <div className="masthead-eyebrow">ACCESS LADDER</div>
          <h3>Earned access, not an open compute tap.</h3>
        </div>
        <ol>
          <li><span>NOW</span><strong>Private operator</strong><p>Joe controls the snapshot, runtime, and all lifecycle decisions.</p></li>
          <li><span>NEXT</span><strong>Trusted guests</strong><p>Named accounts, fixed limits, dedicated guest image, and operator kill switch.</p></li>
          <li><span>ALWAYS</span><strong>Bring your own org</strong><p>Your infrastructure, your billing, your boundary. MoltAgent provides the recipe.</p></li>
        </ol>
      </section>

      <section className="guide-footnote">
        <ShieldCheck size={17} />
        <p><strong>Outposts is available on Pro, Max, and Teams accounts.</strong> Use this for isolated coding tasks, controlled repository access, and repeatable agent environments. Not for bypassing Devin ACUs or running a public sandbox without billing controls.</p>
      </section>
    </article>
  );
}
