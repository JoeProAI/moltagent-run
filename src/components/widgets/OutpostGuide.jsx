import { ArrowRight, CheckCircle2, ExternalLink, KeyRound, LockKeyhole, Server, ShieldCheck, TriangleAlert } from 'lucide-react';
import hero from '../../assets/hero.png';

export default function OutpostGuide({ onNavigate }) {
  const steps = [
    ['01', 'Bring your infrastructure', 'Create a Daytona API key in the Daytona org that should own the compute. Keep it in your terminal or Vercel, never in a prompt.'],
    ['02', 'Create an Outpost', 'In Devin Enterprise, create an Outpost and generate its token. Devin keeps the agent loop and bills ACUs; Daytona hosts the isolated execution environment.'],
    ['03', 'Build the runtime image', 'Follow the official Daytona guide to install and register the Devin Outpost runtime, then save the working image as a Daytona snapshot.'],
    ['04', 'Launch and verify', 'Set DAYTONA_SNAPSHOT, create one sandbox, and confirm Devin claims a test session before inviting anyone else.'],
  ];

  return (
    <article className="module outpost-guide">
      <header className="guide-hero">
        <div className="guide-hero-copy">
          <div className="masthead-eyebrow">FIELD MANUAL · DEVIN OUTPOSTS</div>
          <h2>Put a Devin crew on infrastructure you control.</h2>
          <p>
            An Outpost gives Devin an isolated Daytona workspace on your infrastructure. Cognition still
            runs the agent and bills ACUs. Daytona supplies the disposable, controlled execution surface.
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
            <span>OUTPOST TOKEN</span>
            <i />
            <span>DAYTONA SANDBOX</span>
          </div>
          <img src={hero} alt="Layered infrastructure diagram" />
        </div>
      </header>

      <section className="guide-callout" aria-label="Current availability">
        <TriangleAlert size={18} />
        <div>
          <strong>Hosted launch is in private validation.</strong>
          <span> A sandbox without a registered Outpost snapshot is only a blank environment. Don’t paste a Devin token until the snapshot is ready.</span>
        </div>
      </section>

      <section className="guide-grid" aria-label="How Outposts work">
        <div className="guide-panel guide-panel-primary">
          <div className="guide-kicker"><Server size={15} /> WHAT YOU GET</div>
          <h3>Isolated execution, not a second Devin.</h3>
          <ul className="guide-list">
            <li><CheckCircle2 size={15} /> Work runs in a disposable Daytona sandbox.</li>
            <li><CheckCircle2 size={15} /> Sandbox state survives sleep, then expires by policy.</li>
            <li><CheckCircle2 size={15} /> Your source code and runtime stay on your chosen infrastructure.</li>
          </ul>
        </div>
        <div className="guide-panel">
          <div className="guide-kicker"><KeyRound size={15} /> WHAT YOU NEED</div>
          <h3>Two accounts. Two scoped credentials.</h3>
          <dl className="guide-credentials">
            <div><dt>Daytona API key</dt><dd>Creates and manages the sandbox.</dd></div>
            <div><dt>Devin Outpost token</dt><dd>Registers that runtime with your Devin Enterprise org.</dd></div>
          </dl>
        </div>
        <div className="guide-panel">
          <div className="guide-kicker"><LockKeyhole size={15} /> WHAT STAYS PRIVATE</div>
          <h3>Credentials are tools, not form fields.</h3>
          <ul className="guide-list">
            <li><CheckCircle2 size={15} /> Never share your Daytona key with a visitor.</li>
            <li><CheckCircle2 size={15} /> Never commit an Outpost token or snapshot secret.</li>
            <li><CheckCircle2 size={15} /> Hosted tokens are injected once, never persisted.</li>
          </ul>
        </div>
      </section>

      <section className="guide-runbook">
        <div className="guide-runbook-head">
          <div>
            <div className="masthead-eyebrow">RUNBOOK</div>
            <h3>From blank sandbox to claimed session.</h3>
          </div>
          <a href="https://www.daytona.io/docs/en/guides/devin/devin-outposts/" target="_blank" rel="noreferrer">
            Open Daytona’s official guide <ExternalLink size={14} />
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

      <section className="guide-access-ladder" aria-label="Guest access roadmap">
        <div>
          <div className="masthead-eyebrow">ACCESS LADDER</div>
          <h3>Earned access, not an open compute tap.</h3>
        </div>
        <ol>
          <li><span>NOW</span><strong>Private operator</strong><p>Joe controls the snapshot, runtime, and all lifecycle decisions.</p></li>
          <li><span>NEXT</span><strong>Trusted guests</strong><p>Named accounts, fixed limits, dedicated guest image, and operator kill switch.</p></li>
          <li><span>ALWAYS</span><strong>Bring your own org</strong><p>Your Daytona, your billing, your boundary. MoltAgent provides the recipe.</p></li>
        </ol>
      </section>

      <section className="guide-footnote">
        <ShieldCheck size={17} />
        <p><strong>Use this for:</strong> isolated coding tasks, controlled repository access, repeatable agent environments. <strong>Not for:</strong> bypassing Devin ACUs, storing long-lived secrets in an image, or running a public sandbox faucet without billing and abuse controls.</p>
      </section>
    </article>
  );
}
