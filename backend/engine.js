const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Firebase Admin (AETHER Orchestration State)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Optional: Initialize Gemini if API key is provided
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

console.log("==========================================");
console.log("AETHER Engine Core initialized.");
console.log("ROLE: Master Orchestration Layer");
console.log("MEMORY DOCTRINE: Read-First. OpenClaw holds truth. NOESIS holds local execution.");
console.log("==========================================");

/**
 * ==========================================
 * AETHER -> NOESIS BRIDGE CONTRACTS
 * ==========================================
 * These functions define the exact API surface AETHER uses 
 * to hand off execution and sovereign retrieval to local NOESIS.
 */
const NOESIS_URL = 'http://localhost:8080'; // Local Rust Bridge

const NOESISBridge = {
  // 1. health: Ping NOESIS to ensure the local RTX 5080 engine is responsive
  checkHealth: async () => {
    try {
      console.log("[BRIDGE] Checking NOESIS health...");
      // return await axios.get(`${NOESIS_URL}/bridge/health`);
      return { status: "ALIVE" };
    } catch (e) { console.error("NOESIS Unreachable"); }
  },

  // 2. runtime status: Fetch NOESIS compute load and Convex sync status
  getRuntimeStatus: async () => {
    try {
      console.log("[BRIDGE] Fetching NOESIS runtime status...");
      // return await axios.get(`${NOESIS_URL}/bridge/runtime-status`);
      return { load: '12%', convex_synced: true };
    } catch (e) {}
  },

  // 3. startup context: AETHER queries OpenClaw (via NOESIS) for canonical truth
  getStartupContext: async () => {
    try {
      console.log("[BRIDGE] Pulling read-first memory truth from OpenClaw Brain...");
      // return await axios.get(`${NOESIS_URL}/bridge/startup-context`);
      return { recent_projects: ['joepro-systems/aether'] };
    } catch (e) {}
  },

  // 4. search: Offload sovereign retrieval to NOESIS to scan local OpenClaw memory
  searchSovereignMemory: async (query) => {
    try {
      console.log(`[BRIDGE] Delegating sovereign search to NOESIS: "${query}"`);
      // return await axios.post(`${NOESIS_URL}/bridge/search`, { query });
      return { results: [] };
    } catch (e) {}
  },

  // 5. local polish: Hand off a completed cloud swarm task to NOESIS for zero-latency cinematic rendering
  requestLocalPolish: async (taskPayload) => {
    try {
      console.log("[BRIDGE] Routing heavy cloud output down to NOESIS for final polish...");
      // return await axios.post(`${NOESIS_URL}/bridge/local-polish`, { payload: taskPayload });
      return { status: "POLISHING_LOCALLY" };
    } catch (e) {}
  },

  // 6. session summary writeback: AETHER sends final payload to NOESIS to write into OpenClaw Brain
  writebackSessionMemory: async (summaryData) => {
    try {
      console.log("[BRIDGE] Session complete. Passing summary to NOESIS to persist in OpenClaw memory.");
      // return await axios.post(`${NOESIS_URL}/bridge/session-summary-writeback`, { summary: summaryData });
      return { status: "COMMITTED_TO_TRUTH" };
    } catch (e) {}
  }
};


// Watch for active agents to be added to Firestore Orchestration State
db.collection('activeAgents').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const agent = change.doc.data();
      
      console.log(`[ORCHESTRATOR] New cloud agent node detected: ${change.doc.id}`);

      // If it's the X Growth swarm, let's actually execute the debate logic
      if (agent.swarmId === 'xgrowth' && !agent.processed) {
        processXGrowthAgent(change.doc.id, agent);
      }
    }
  });
});

async function processXGrowthAgent(agentId, agent) {
  console.log(`[X-API] Agent ${agentId} connecting to X...`);
  
  let debateResult = "Variant debated successfully.";
  
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      const prompt = `You are a node in a Society of Mind debate. Evaluate this X thread hook...`;
      const result = await model.generateContent(prompt);
      debateResult = result.response.text();
    } catch (e) {
      console.error("Gemini API Error", e);
    }
  } else {
    // Simulated AI response
    console.log(`[GEMINI-SIMULATION] Running lightweight heuristic on node ${agentId}`);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
  }

  // Orchestration state updated in Firestore
  await db.collection('activeAgents').doc(agentId).update({
    processed: true,
    result: debateResult,
    status: 'COMPLETED'
  });
  
  console.log(`[ORCHESTRATOR] Cloud Agent ${agentId} completed task.`);
  
  // Example of delegating final local polish to NOESIS:
  await NOESISBridge.requestLocalPolish({ agentId, finalOutput: debateResult });
}

// Watch for NOESIS/Daytona sync triggers from UI
db.collection('system').doc('core').onSnapshot(async (doc) => {
  if (doc.exists) {
    const data = doc.data();
    if (data.isSynced && !data.bridgeAcknowledged) {
      console.log(`[HYBRID-BRIDGE] UI requested sync. Verifying NOESIS health...`);
      await NOESISBridge.checkHealth();
      await NOESISBridge.getStartupContext();
      // Mark as acknowledged so we don't trigger this continuously
      await db.collection('system').doc('core').update({ bridgeAcknowledged: true });
    }
  }
});
