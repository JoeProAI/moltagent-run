# One-Click Sync with NOESIS

AETHER is designed to be the cosmic layer above your local NOESIS companion. Here is how to establish the bidirectional bridge.

## Step 1: Initialize the Local Rust Microservice
AETHER communicates with your MSI Raider 18 AI HX 5080 through a blazing-fast local Rust microservice.
1. Navigate to your NOESIS root folder.
2. Run `cargo run --bin aether-bridge`
3. This opens `localhost:4040` as the zero-latency handoff port.

## Step 2: Connect AETHER
1. Open the **AETHER Canvas** (`npm run dev`).
2. Click on the **Hybrid Bridge** module in the sidebar.
3. Under the "Local NOESIS" card, click **Sync**.
4. AETHER will automatically handshake with `localhost:4040`.

## Step 3: Test the Pipeline
Try speaking this into the AETHER voice interface:
> "AETHER, spin up a 200-agent cinematic video constellation on my latest concept and sync the best 3 outputs to NOESIS for final polish."

**What Happens:**
1. AETHER routes the massive 200-agent brainstorming swarm to Google Vertex AI.
2. The 3 winning outputs are compressed and piped via LanceDB sync to your local machine.
3. NOESIS wakes up on your RTX 5080, loads the outputs, and applies the final cinematic color-grading and rendering locally (cost: $0).

**Zero Gravity. Infinite Power.**
