import { ArrowRight, BookOpen, ExternalLink, Cpu, Layers } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div className="module outpost-command">
      <section className="outpost-command-hero">
        <div className="outpost-command-copy">
          <div className="masthead-eyebrow">MOLTAGENT.RUN · OUTPOSTS CONTROL ROOM</div>
          <h1>Run Devin on infrastructure you control.</h1>
          <p>
            Devin Outposts let you run the execution layer on your own compute.
            Cognition handles reasoning in the cloud. You host the worker, control
            the queue, and see every session in the fleet API.
          </p>
          <div className="outpost-command-actions">
            <button type="button" className="btn primary" onClick={() => onNavigate('guide')}>
              <BookOpen size={14} /> Read the Outposts guide
            </button>
            <button type="button" className="btn quiet" onClick={() => onNavigate('outposts')}>
              Open fleet control <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <aside className="outpost-proof-card" aria-label="Fleet API status">
          <div className="outpost-proof-top">
            <span>OPBETA FLEET API</span>
            <span className="outpost-proof-dot">LIVE</span>
          </div>
          <div className="outpost-proof-id">OUTPOST / 01</div>
          <dl>
            <div><dt>API</dt><dd>/opbeta/outposts/devins</dd></div>
            <div><dt>WORKER</dt><dd>devin worker start</dd></div>
            <div><dt>CLAIM</dt><dd>Atomic session claim</dd></div>
            <div><dt>RELEASE</dt><dd>Return to queue</dd></div>
          </dl>
          <p>Sessions queue on your outpost. Workers claim them atomically. The fleet API tracks status, depth, and active claims.</p>
        </aside>
      </section>

      <section className="outpost-boundary" aria-label="How Outposts work">
        <div className="outpost-boundary-head">
          <div>
            <div className="masthead-eyebrow">THE EXECUTION BOUNDARY</div>
            <h2>Reasoning stays with Devin. Execution lands on your worker.</h2>
          </div>
          <p>An Outpost is not a second AI. It is the controlled execution layer where Devin can run tool calls on real compute that you provision and observe.</p>
        </div>
        <ol className="outpost-boundary-rail">
          <li>
            <span className="outpost-stage-number">01</span>
            <h3>Devin receives work</h3>
            <p>The agent loop reasons over the task in Cognition's cloud.</p>
            <small>AGENT + ACUs</small>
          </li>
          <li>
            <span className="outpost-stage-number">02</span>
            <h3>Session queues</h3>
            <p>Work targets your outpost and enters the queue visible at /opbeta/outposts/devins.</p>
            <small>QUEUE + FLEET API</small>
          </li>
          <li>
            <span className="outpost-stage-number">03</span>
            <h3>Worker claims</h3>
            <p>Your worker atomically claims the session and executes tool calls locally.</p>
            <small>CLAIM + EXECUTE</small>
          </li>
          <li>
            <span className="outpost-stage-number">04</span>
            <h3>Session completes</h3>
            <p>The worker releases or terminates. The ledger shows every state transition.</p>
            <small>RELEASE + CLEANUP</small>
          </li>
        </ol>
      </section>

      <section className="outpost-access-grid" aria-label="Ways to run Outposts">
        <article className="outpost-access-card outpost-access-card-primary">
          <div className="outpost-access-kicker"><Cpu size={15} /> FIRST-PARTY WORKER</div>
          <h2>Run the official Devin worker on your machine.</h2>
          <p>
            Install the CLI and start a worker against your outpost.
            Works with Pro, Max, and Teams plans. The worker claims sessions
            automatically and reports status to the fleet API.
          </p>
          <button type="button" className="btn primary" onClick={() => onNavigate('outposts')}>
            Open fleet control <ArrowRight size={14} />
          </button>
        </article>
        <article className="outpost-access-card">
          <div className="outpost-access-kicker"><Layers size={15} /> PARTNER PLATFORMS</div>
          <h2>Run on managed infrastructure.</h2>
          <p>
            Partner platforms handle the runtime while you keep control of the outpost.
            Current partners: Daytona, Cloudflare, Modal, E2B, Namespace, NVIDIA.
          </p>
          <a className="btn quiet" href="https://docs.devin.ai/cloud/outposts/overview#integrations" target="_blank" rel="noreferrer">
            View partner integrations <ExternalLink size={14} />
          </a>
        </article>
      </section>

      <section className="guide-access-ladder" aria-label="Getting started">
        <div>
          <div className="masthead-eyebrow">GETTING STARTED</div>
          <h3>From zero to running worker in three steps.</h3>
        </div>
        <ol>
          <li>
            <span>01</span>
            <strong>Create an outpost</strong>
            <p>In Devin Cloud: Settings, Environment, Outposts. Copy the token shown at creation.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Install the CLI</strong>
            <p>curl -fsSL https://cli.devin.ai/install.sh | bash</p>
          </li>
          <li>
            <span>03</span>
            <strong>Start a worker</strong>
            <p>devin worker start --outpost=name --token=token</p>
          </li>
        </ol>
      </section>

    </div>
  );
}
