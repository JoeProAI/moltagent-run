# AETHER: System Architecture & Ecosystem Canon

This document formalizes AETHER's exact role within the broader **joepro-systems** ecosystem canon. It is designed to act as the ultimate ground-truth reference for all autonomous agents (Codex, Windsurf, Cascade) operating on this repository.

## 1. Architecture Doctrine (The Canon)

*   **AETHER Above:** Master orchestration layer, global swarm routing, cloud workload coordination.
*   **NOESIS Local and Sovereign:** The local execution authority handling sovereign retrieval, local execution, and final cinematic polish.
*   **OpenClaw Brain as Memory Truth:** The definitive long-term memory store. AETHER is strictly **read-first** and does not maintain a parallel memory store.
*   **Firestore for Orchestration State:** The real-time transient state machine for swarm orchestration and AETHER constellation rendering.
*   **Convex for NOESIS Product State:** The database for NOESIS's local application layer state.

**Explicitly, AETHER is NOT:**
- The long-term memory truth.
- The local execution authority.
- A replacement for NOESIS.

---

## 2. The Overall Ecosystem Topology

AETHER acts as the cosmic nervous system routing tasks between platforms:
- **Firestore (AETHER State):** The transient state machine for visual rendering. The React frontend writes tasks here, and the backend orchestrator reads from here.
- **NOESIS (Local Edge):** Runs locally on the MSI Raider 18 AI HX 5080. AETHER offloads tasks down to NOESIS via explicit Bridge Contracts for local rendering or private execution.
- **OpenClaw Brain:** The memory truth. AETHER pulls startup context and session history from OpenClaw but does not store long-term data itself.
- **Daytona.io:** Active cloud development workspace provider.
- **Gemini / Vertex AI:** The cloud cognitive engine.

---

## 3. AETHER -> NOESIS Bridge Contracts
The communication between AETHER and NOESIS is handled via strictly defined local APIs. The first defined AETHER -> NOESIS bridge calls are:

1.  `/bridge/health`: Pings NOESIS to ensure the local RTX 5080 engine is responsive.
2.  `/bridge/runtime-status`: Fetches NOESIS's current compute load and Convex sync status.
3.  `/bridge/startup-context`: AETHER queries NOESIS (which queries OpenClaw) for the latest user state, recent projects, and established canons.
4.  `/bridge/search`: AETHER offloads sovereign retrieval requests to NOESIS to scan local OpenClaw memory without exposing it to the cloud.
5.  `/bridge/local-polish`: AETHER hands off a completed cloud swarm task (e.g., a drafted video or X thread) to NOESIS for final high-fidelity, zero-latency cinematic rendering.
6.  `/bridge/session-summary-writeback`: At the end of a session, AETHER sends a final payload to NOESIS. NOESIS then securely writes this truth back into the OpenClaw Brain.

---

## 4. Folder Structure & Agent Navigation Guide

### `/src` (The React Frontend)
The visual representation layer. Reads/writes transient orchestration state to Firestore.
- **`App.jsx`**: Global state and Firestore listeners.
- **`firebase.js`**: Web SDK initialization and Firebase config.
- **`index.css`**: The "Zero Gravity Cinematic" design system (pure CSS, Cinzel + JetBrains Mono).
- **`/components/Canvas3D.jsx`**: WebGL engine mapping `activeAgents` to orbiting celestial nodes.
- **`/components/widgets/`**: `AgentFactory.jsx`, `XGrowth.jsx`, `NOESISBridge.jsx`.

### `/backend` (The Execution Engine)
The physical cloud daemon.
- **`engine.js`**: The Node.js orchestrator. Initializes `firebase-admin`, listens to Firestore, routes massive swarms to Gemini, and executes the AETHER -> NOESIS bridge calls.

### `/root` (Config & Docs)
- **`firestore.rules`**: Security rules for `activeAgents` and `system` collections.
- **`AETHER_README.md`**: Public-facing canonical project summary.
