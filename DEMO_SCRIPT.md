# Devin Outpost Super Executor — Demo Script
# ============================================
# JoePro AI — Cognition Ambassador Demo
# Duration: ~5 minutes
# Goal: Show Devin Outposts running on Daytona, dispatched from a custom dashboard

## PRE-SETUP (before recording)
# 1. Start the Daytona orchestrator: devin-outposts-orchestrator
# 2. Open MoltAgent.run in browser, navigate to S7
# 3. Have a sample repo ready to dispatch against
# 4. Have the Daytona dashboard open in a second tab

## THE DEMO

### 0. HOOK (15 seconds)
"What if every Devin session ran on YOUR hardware? Your GPU. Your network. Your firewall.
Cognition just shipped Devin Outposts. I built the cockpit for it.
Let me show you."

### 1. SIDEBAR WALK (20 seconds)
*Click through S1-S7 plates slowly*
"Seven modules in the MoltAgent swarm workbench.
App Swarm. Carapace firewall. MECHA Run. Agent Factory. X Multiplier. Hybrid Bridge.
And S7 — the Devin Outpost Super Executor. Brand new. Just shipped."

### 2. CREDIT RUNWAY (30 seconds)
*Click S7. Let the dashboard load.*
"This is a personal cockpit. Not a mockup — it polls Devin's Outpost API every 5 seconds.
Top left: active sessions. Queued sessions. And the credit runway meter.
16,000 Daytona credits at ~$0.23 per active hour? That's basically a year of Devin sessions.
Sessions sleep for free. You only pay when Devin is actively coding."

### 3. DISPATCH A SESSION (60 seconds)
*Click DISPATCH tab. Type a real prompt.*
"Let's dispatch. I'll ask Devin to audit the MoltAgent codebase — all 7 modules —
run the test suite, and suggest improvements.
Repository field: pre-clone the repo into the sandbox so Devin starts with code already there.
Hit dispatch. Watch the event log..."

*Click Dispatch. Watch the log appear.*
"Session queued. The Daytona orchestrator just claimed it. A sandbox is spinning up right now."

*Switch to Daytona dashboard in other tab.*
"This is the Daytona dashboard. You can see the sandbox — devin-<session_id> — created on demand.
Sub-90ms from snapshot. Devin's remote binary is checksummed, verified, and launched inside it."

*Switch back to MoltAgent.*
"And back in MoltAgent: the session just appeared in the ambient 3D canvas as a live node.
Hover it — type, task, load. Part of the swarm now."

### 4. QUEUE & SANDBOXES (30 seconds)
*Click QUEUE tab.*
"Queue tab: every session — running, queued, sleeping. Real-time. I can terminate from here
if something goes wrong. No switching to the Devin app."

*Click SANDBOXES tab.*
"Sandboxes tab: the actual Daytona infrastructure. Every box tagged. State, creation time.
This is ground truth — not a simulation."

### 5. CARAPACE FIREWALL (20 seconds)
*Click S2 — Carapace Firewall.*
"And the reason this matters: the Carapace firewall. Five defensive planes.
When Devin runs on your hardware through an outpost, the memory boundary between
Cognition's cloud reasoning and your local state needs protection.
Ingress tagging. Promotion gating. Egress scanning. Five planes, all armed."

### 6. CLOSE (20 seconds)
"Devin Outposts just dropped. This is day-one integration — personal cockpit,
live queue, Daytona sandbox lifecycle, credit runway math, and a firewall between
cloud reasoning and local execution.
All open source at moltagent.run. Link in bio.
If you have Devin Enterprise, you can run this today."

## TALKING POINTS (if Q&A or longer format)

- "Why Daytona? Sub-90ms sandbox spin-up from snapshot. Linux and Windows. Pay only for active compute."
- "Why your own dashboard? The default Devin UI is great. But when you're running multiple
  agents — MECHA, Factory, X Growth — you want one cockpit. One surface. One swarm."
- "Firewall: Devin's agent loop is in Cognition's cloud. Execution is on your hardware.
  That's a trust boundary. Carapace gates it."
- "16K Daytona credits = ~$200 free tier. At $0.23/hr active, that's months of sessions.
  Sleeping sessions cost zero. Real runway is closer to a year for most users."
- "This isn't a SaaS. It's a personal productivity tool. My cockpit for my work.
  But the architecture — anyone can build this. The Outposts API is open."

## TECH SETUP (for nerds who ask)

```
# One-time setup
git clone https://github.com/daytona/guides.git
cd guides/python/cognition/devin-outposts
python3.12 -m venv .venv && source .venv/bin/activate
pip install -e .
outposts-connect --platform linux    # creates outpost, writes .env
build-devin-outposts-snapshot        # builds Daytona snapshot

# Run the orchestrator (keep this running)
devin-outposts-orchestrator

# Deploy the MoltAgent dashboard
# Set Vercel env: DEVIN_OUTPOSTS_TOKEN, DAYTONA_API_KEY, OUTPOST_ID, SNAPSHOT_NAME
# That's it. Open moltagent.run, click S7.
```
