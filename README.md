# MoltAgent.run

Multi-agent swarm workbench, Carapax memory firewall, and X creator growth studio.
Live at [moltagent.run](https://www.moltagent.run).

## Stack

- React 19 + Vite 8, deployed on Vercel
- Firebase Firestore for live agent swarm state
- Three.js / React Three Fiber ambient agent constellation
- Vercel serverless functions in `api/` for everything a browser can't do

## Design system

"Chitin Command" — warm chitin-black surfaces, amber resin accent (`#E8A832`),
bone text, chamfered plate geometry. Tokens live in `src/index.css`. Zero
border-radius; 1px seams create structure. Space Grotesk display, Plus Jakarta
Sans body, JetBrains Mono for terminal and data.

## Modules

| Plate | Module | What it does |
|---|---|---|
| S1 | Android Swarm | 5-agent parallel Android build crew, Compose workbench, CLI/ADB bridge |
| S2 | Carapax Firewall | 5-plane memory integrity model + hash-chained audit ledger |
| S3 | M.E.C.H.A. Run | Quad Crew debate + up to 50 Codex sandbox fan-out, gBrain vault, SaaS tiers |
| S4 | Agent Factory | Spawn and retire swarm crews as live Firestore agent nodes |
| S5 | X Multiplier | Live @JoePro telemetry (X API v2) + Claude-powered viral hook A/B engine |
| S6 | Hybrid Bridge | Route work between local RTX 5080 (NOESIS) and cloud (Daytona) |

## Serverless functions

| Route | Purpose | Required env |
|---|---|---|
| `POST /api/x-metrics` | Proxies X API v2 (browsers are CORS-blocked from api.twitter.com) | Optional `X_BEARER_TOKEN` fallback; token can also be pasted in the UI |
| `POST /api/generate-hooks` | Generates and scores 25 tweet hooks with Claude | `ANTHROPIC_API_KEY` |
| `POST /api/checkout` | Creates a Stripe Checkout Session per tier | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_DEVELOPER`, `STRIPE_PRICE_SWARM_PRO`, `STRIPE_PRICE_ENTERPRISE_SWARM` |

Each function degrades gracefully: the UI shows an honest "not configured"
state instead of pretending, until the env vars are set in Vercel.

## Development

```bash
npm install
npm run dev        # UI only — /api routes 404 locally
vercel dev         # UI + serverless functions
npm run build      # production build to dist/
```

## Social / meta assets

`public/og-image.png` (1200×630) and `public/og-image-square.png` (1200×1200)
are rendered from `public/og-card.html` / `og-card-square.html` — edit the HTML
and re-screenshot at the matching viewport to regenerate.
