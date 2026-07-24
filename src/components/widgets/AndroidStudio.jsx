import { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Play,
  Copy,
  Check,
  Code,
  Command,
  Flame,
  RefreshCw,
  Globe,
  Smartphone,
  Server,
  Monitor
} from 'lucide-react';

// One build config per platform (mobile expands into three targets). Each holds
// its own prompt scaffold, generated sample, preview frame, and CLI presets so
// the whole module retargets from one selector.
const CONFIGS = {
  web: {
    label: 'Web app',
    blurb: 'Describe the app once. The crew splits the work: architecture, build tooling, browser testing, audit, deploy.',
    tags: ['Next.js 16', 'React 19', 'Tailwind v4', 'Server Components'],
    prompt: 'Build a fast Next.js 16 dashboard with server components, Tailwind v4, streaming data, and dark mode',
    lang: 'TSX',
    preview: 'browser',
    deviceLabel: 'localhost:3000',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the brief into route, component, and data-layer subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing server components and typed data-fetching hooks.' },
      { agent: 'Grok Build', msg: 'Vite/Turbopack bundle warm. Tree-shaking and code-splitting applied.' },
      { agent: 'Devin', msg: 'Playwright journey tests green across Chromium, Firefox, WebKit.' },
      { agent: 'Hermes', msg: 'Production build validated. Vercel deploy preview standing by.' }
    ],
    sample: `import { useState } from 'react';

type Agent = { name: string; role: string; status: 'online' | 'busy' };

export function AgentCard({ name, role, status }: Agent) {
  return (
    <div className="flex items-center justify-between rounded-lg
                    border border-white/10 bg-slate-900 p-4">
      <div>
        <p className="font-semibold text-slate-100">{name}</p>
        <p className="text-xs text-slate-400">{role}</p>
      </div>
      <span className="rounded bg-amber-500/15 px-2 py-1 text-xs
                       font-bold uppercase text-amber-400">
        {status}
      </span>
    </div>
  );
}`,
    cli: [
      'npm create vite@latest swarm-app',
      'npm run dev',
      'npm run build',
      'npx tsc --noEmit',
      'npx playwright test'
    ]
  },

  'mobile-android': {
    label: 'Android',
    blurb: 'Describe the app once. The crew splits the work: architecture, Kotlin compile, AVD device testing, audit, release.',
    tags: ['Jetpack Compose', 'Kotlin', 'Hilt DI', 'Coroutines'],
    prompt: 'Build a clean, high-performance Jetpack Compose Android app with Hilt DI, ViewModel, and Coroutines StateFlow',
    lang: 'Kotlin',
    preview: 'phone',
    deviceLabel: 'Pixel 7 · API 34',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the brief into screen, ViewModel, and DI subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing Compose state trees and Hilt dependency modules.' },
      { agent: 'Grok Build', msg: 'Gradle 8.7 daemon warm. Kotlin Symbol Processing cache primed.' },
      { agent: 'Devin', msg: 'ADB journey tests green on Pixel 7 API 34 emulator.' },
      { agent: 'Hermes', msg: 'APK build validated. Play Console upload standing by.' }
    ],
    sample: `package com.moltagent.swarm.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AgentCard(name: String, role: String, status: String) {
    Card(
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF171C30)),
        modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(name, color = Color(0xFFEDF1FC), fontSize = 16.sp, fontWeight = FontWeight.Bold)
                Text(role, color = Color(0xFFA9B2CC), fontSize = 12.sp)
            }
            Surface(shape = RoundedCornerShape(4.dp), color = Color(0xFF232A47)) {
                Text(status.uppercase(), color = Color(0xFFE8A832), fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
            }
        }
    }
}`,
    cli: [
      'android sdk list --all',
      'android emulator list',
      'adb devices -l',
      'gradle assembleDebug',
      'android docs search --query="Compose State"'
    ]
  },

  'mobile-ios': {
    label: 'iOS',
    blurb: 'Describe the app once. The crew splits the work: architecture, Swift compile, simulator testing, audit, release.',
    tags: ['SwiftUI', 'Swift 6', 'Swift Concurrency', 'MVVM'],
    prompt: 'Build a polished SwiftUI iOS app with async/await networking, an observable view model, and dark mode',
    lang: 'Swift',
    preview: 'phone',
    deviceLabel: 'iPhone 16 · iOS 18',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the brief into view, view-model, and networking subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing SwiftUI views and @Observable state.' },
      { agent: 'Grok Build', msg: 'Swift build graph warm. Incremental compilation primed.' },
      { agent: 'Devin', msg: 'XCUITest journeys green on iPhone 16 simulator.' },
      { agent: 'Hermes', msg: 'Archive validated. TestFlight upload standing by.' }
    ],
    sample: `import SwiftUI

struct AgentCard: View {
    let name: String
    let role: String
    let status: String

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(name).font(.headline).foregroundStyle(.white)
                Text(role).font(.caption).foregroundStyle(.gray)
            }
            Spacer()
            Text(status.uppercased())
                .font(.caption2).bold()
                .padding(.horizontal, 8).padding(.vertical, 4)
                .background(.orange.opacity(0.15))
                .foregroundStyle(.orange)
                .clipShape(.rect(cornerRadius: 4))
        }
        .padding()
        .background(Color(red: 0.09, green: 0.11, blue: 0.19))
        .clipShape(.rect(cornerRadius: 8))
    }
}`,
    cli: [
      'xcrun simctl list devices',
      'xcodebuild -scheme SwarmApp build',
      'xcrun simctl boot "iPhone 16"',
      'swift test',
      'xcodebuild -exportArchive'
    ]
  },

  'mobile-cross': {
    label: 'Cross-platform',
    blurb: 'Describe the app once. The crew ships one codebase to both iOS and Android: architecture, bundle, device testing, audit, release.',
    tags: ['React Native', 'Expo', 'TypeScript', 'iOS + Android'],
    prompt: 'Build a cross-platform Expo app in React Native with typed navigation, a shared design system, and OTA updates',
    lang: 'TSX',
    preview: 'phone',
    deviceLabel: 'Expo Go · iOS + Android',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the brief into screen, navigation, and native-module subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing React Native components and typed navigation.' },
      { agent: 'Grok Build', msg: 'Metro bundler warm. Hermes engine bytecode primed.' },
      { agent: 'Devin', msg: 'Maestro flows green on both iOS and Android simulators.' },
      { agent: 'Hermes', msg: 'EAS build validated. OTA update channel standing by.' }
    ],
    sample: `import { View, Text, StyleSheet } from 'react-native';

type Agent = { name: string; role: string; status: string };

export function AgentCard({ name, role, status }: Agent) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <Text style={styles.status}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between',
          backgroundColor: '#171C30', borderRadius: 8, padding: 16 },
  name: { color: '#EDF1FC', fontSize: 16, fontWeight: '700' },
  role: { color: '#A9B2CC', fontSize: 12 },
  status: { color: '#E8A832', fontSize: 10, fontWeight: '700' },
});`,
    cli: [
      'npx create-expo-app swarm-app',
      'npx expo start',
      'npx expo run:ios',
      'npx expo run:android',
      'eas build --platform all'
    ]
  },

  backend: {
    label: 'Backend / API',
    blurb: 'Describe the service once. The crew splits the work: schema, endpoints, load testing, security audit, deploy.',
    tags: ['Node 24', 'Express', 'Postgres', 'JWT'],
    prompt: 'Build a Node/Express REST API with JWT auth, a Postgres schema, rate limiting, and request validation',
    lang: 'JavaScript',
    preview: 'terminal',
    deviceLabel: 'node · :3000',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the spec into schema, route, and middleware subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing typed handlers and a Prisma schema.' },
      { agent: 'Grok Build', msg: 'Dependency graph resolved. tsx watch server hot.' },
      { agent: 'Devin', msg: 'Supertest + k6 load suite green. p95 under 40ms at 500 rps.' },
      { agent: 'Hermes', msg: 'Container image built. Railway deploy standing by.' }
    ],
    sample: `import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/agents', authenticate, async (req, res) => {
  const agents = await db.agent.findMany({ where: { ownerId: req.userId } });
  res.json({ agents });
});

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;`,
    cli: [
      'npm run dev',
      'npx prisma migrate dev',
      'curl -s localhost:3000/health',
      'npm test',
      'k6 run load-test.js'
    ]
  },

  desktop: {
    label: 'Desktop app',
    blurb: 'Describe the app once. The crew splits the work: architecture, native build, cross-OS testing, audit, package.',
    tags: ['Tauri', 'Rust', 'React', 'Native FS'],
    prompt: 'Build a Tauri desktop app with a React UI, native file-system access, and a system tray',
    lang: 'Rust',
    preview: 'window',
    deviceLabel: 'MoltAgent Desktop',
    steps: [
      { agent: 'Antigravity', msg: 'Decomposing the brief into UI, command, and IPC subagents.' },
      { agent: 'Claude Code', msg: 'Synthesizing Tauri commands and the React front end.' },
      { agent: 'Grok Build', msg: 'Cargo build graph warm. Rust incremental cache primed.' },
      { agent: 'Devin', msg: 'WebDriver tests green on Windows, macOS, and Linux runners.' },
      { agent: 'Hermes', msg: 'Signed bundles built (.msi / .dmg / .AppImage). Release standing by.' }
    ],
    sample: `use tauri::command;

#[command]
fn dispatch_swarm(prompt: String, agents: usize) -> Result<String, String> {
    if prompt.trim().is_empty() {
        return Err("Prompt cannot be empty".into());
    }
    Ok(format!("Dispatched {agents} agents for: {prompt}"))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![dispatch_swarm])
        .run(tauri::generate_context!())
        .expect("error while running MoltAgent desktop");
}`,
    cli: [
      'cargo tauri dev',
      'cargo check',
      'cargo tauri build',
      'cargo test',
      'cargo clippy'
    ]
  }
};

const ROSTER = [
  { name: 'Antigravity', role: 'Master architect', desc: 'Decomposes your prompt and leases subagents.' },
  { name: 'Grok Build', role: 'Build & compile', desc: 'Bundling, caching, and compile optimization.' },
  { name: 'Devin', role: 'Full-stack engineer', desc: 'End-to-end and device/browser testing.' },
  { name: 'Claude Code', role: 'Architecture auditor', desc: 'State design, types, and security review.' },
  { name: 'Hermes', role: 'Release executor', desc: 'Packaging, deploy, and release pipelines.' }
];

const PLATFORM_OPTIONS = [
  { id: 'web', label: 'Web', icon: <Globe size={13} /> },
  { id: 'mobile', label: 'Mobile', icon: <Smartphone size={13} /> },
  { id: 'backend', label: 'Backend', icon: <Server size={13} /> },
  { id: 'desktop', label: 'Desktop', icon: <Monitor size={13} /> }
];

const MOBILE_TARGETS = [
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'cross', label: 'Cross-platform' }
];

export default function AndroidStudio({ setActiveAgents, activeAgents }) {
  const [activeTab, setActiveTab] = useState('dispatch');
  const [platform, setPlatform] = useState('web');
  const [mobileTarget, setMobileTarget] = useState('android');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const cfgKey = platform === 'mobile' ? `mobile-${mobileTarget}` : platform;
  const cfg = CONFIGS[cfgKey];

  const [promptInput, setPromptInput] = useState(cfg.prompt);
  const [promptEdited, setPromptEdited] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  const [cliCommand, setCliCommand] = useState('');
  const [cliOutput, setCliOutput] = useState(['Ready. Pick a preset below or type a command for the current platform.']);

  // When the platform changes, refresh the prompt scaffold unless the user has
  // typed their own. Keeps the example honest to the selected target.
  const selectPlatform = (id) => {
    setPlatform(id);
    const nextKey = id === 'mobile' ? `mobile-${mobileTarget}` : id;
    if (!promptEdited) setPromptInput(CONFIGS[nextKey].prompt);
  };
  const selectTarget = (id) => {
    setMobileTarget(id);
    if (!promptEdited) setPromptInput(CONFIGS[`mobile-${id}`].prompt);
  };

  const handleRunAgentParty = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    setAgentLogs([]);

    cfg.steps.forEach((step, index) => {
      setTimeout(() => {
        setAgentLogs(prev => [...prev, { ...step, time: new Date().toLocaleTimeString() }]);
        if (index === cfg.steps.length - 1) {
          setIsBuilding(false);
          if (setActiveAgents && activeAgents) {
            setActiveAgents([...activeAgents, {
              id: `build-${Date.now().toString().slice(-4)}`,
              type: `${cfg.label} specialist`,
              task: promptInput.substring(0, 20),
              load: '98%',
              position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
              color: '#E8A832',
              scale: 0.35,
              speed: 0.1,
              speedOffset: Math.random() * Math.PI
            }]);
          }
        }
      }, (index + 1) * 850);
    });
  };

  const handleCopyCode = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const runPresetCli = (cmd) => {
    if (!cmd.trim()) return;
    setCliCommand(cmd);
    setCliOutput(prev => [...prev, `\n$ ${cmd}`, `[running via the ${cfg.label} agent…]`]);
    setTimeout(() => {
      setCliOutput(prev => [...prev, `Command completed cleanly (exit code 0).`]);
    }, 550);
  };

  const previewCard = (
    <div className="phone-screen" style={{ minHeight: 'unset', flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: 'var(--frost)', borderBottom: '1px solid var(--seam)', paddingBottom: '6px' }}>
        MoltAgent Swarm Studio
      </div>
      {['Antigravity', 'Grok Build', 'Devin'].map((name, i) => (
        <div key={i} className="roster-row" style={{ padding: '8px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--frost)', fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: '0.56rem', color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}>ONLINE</div>
        </div>
      ))}
    </div>
  );

  const renderPreview = () => {
    if (cfg.preview === 'phone') {
      return <div className="phone-frame">{previewCard}</div>;
    }
    if (cfg.preview === 'terminal') {
      return (
        <div style={{ background: 'var(--ink-0)', border: '1px solid var(--seam)', minHeight: '340px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', gap: '5px', padding: '8px 10px', borderBottom: '1px solid var(--seam)' }}>
            {['#F2555A', '#E8A832', '#63E6BE'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
            <span style={{ color: 'var(--frost-3)', marginLeft: 6 }}>{cfg.deviceLabel}</span>
          </div>
          <div style={{ padding: '12px', color: 'var(--frost-2)', lineHeight: 1.7 }}>
            <div style={{ color: 'var(--ok)' }}>$ npm run dev</div>
            <div>server listening on http://localhost:3000</div>
            <div>GET /health <span style={{ color: 'var(--ok)' }}>200</span> 3ms</div>
            <div>GET /agents <span style={{ color: 'var(--ok)' }}>200</span> 11ms</div>
            <div style={{ color: 'var(--amber)' }}>▮</div>
          </div>
        </div>
      );
    }
    // browser + window frames share a chrome-with-titlebar shell
    const isBrowser = cfg.preview === 'browser';
    return (
      <div style={{ background: 'var(--ink-2)', border: '1px solid var(--seam-strong)', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderBottom: '1px solid var(--seam)' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#F2555A', '#E8A832', '#63E6BE'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
          </div>
          {isBrowser && (
            <div style={{ flex: 1, background: 'var(--ink-0)', border: '1px solid var(--seam)', borderRadius: 4, padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--frost-3)' }}>
              {cfg.deviceLabel}
            </div>
          )}
          {!isBrowser && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--frost-3)' }}>{cfg.deviceLabel}</span>}
        </div>
        <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>{previewCard}</div>
      </div>
    );
  };

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S1 · App swarm</div>
          <h2 className="masthead-title">Five agents build your app in parallel</h2>
          <p className="masthead-sub">{cfg.blurb}</p>
        </div>
        <div className="masthead-actions">
          <div className="tabset" role="tablist">
            {[
              { id: 'dispatch', label: 'DISPATCH', icon: <Flame size={13} /> },
              { id: 'workbench', label: 'WORKBENCH', icon: <Code size={13} /> },
              { id: 'cli', label: 'CLI BRIDGE', icon: <Terminal size={13} /> },
              { id: 'skills', label: 'SKILL MATRIX', icon: <Sparkles size={13} /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform selector — always visible; mobile reveals target sub-fields */}
      <div className="panel">
        <div className="panel-head" style={{ marginBottom: 'var(--sp-3)' }}>
          <div className="panel-title">What are you building?</div>
          <span className="panel-note">Retargets the crew, code, preview, and CLI</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <span className="field-label">Platform</span>
            <div className="tabset" role="tablist">
              {PLATFORM_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={platform === opt.id}
                  className={`tab ${platform === opt.id ? 'active' : ''}`}
                  onClick={() => selectPlatform(opt.id)}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {platform === 'mobile' && (
            <div>
              <span className="field-label">Mobile target</span>
              <div className="tabset" role="tablist">
                {MOBILE_TARGETS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={mobileTarget === t.id}
                    className={`tab ${mobileTarget === t.id ? 'active' : ''}`}
                    onClick={() => selectTarget(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {cfg.tags.map((tag, i) => <span key={i} className="badge">{tag}</span>)}
          </div>
        </div>
      </div>

      {/* TAB 1: DISPATCH */}
      {activeTab === 'dispatch' && (
        <div className="grid cols-main-side">

          <div className="stack">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  <Command size={15} />
                  Task dispatcher
                </div>
                <span className="panel-note">1 prompt → 5 specialized agents</span>
              </div>

              <label className="field-label" htmlFor="build-prompt">Describe the {cfg.label.toLowerCase()} to build</label>
              <textarea
                id="build-prompt"
                className="textarea"
                value={promptInput}
                onChange={(e) => { setPromptInput(e.target.value); setPromptEdited(true); }}
                rows={3}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={handleRunAgentParty}
                    disabled={isBuilding}
                  >
                    {isBuilding ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                    {isBuilding ? 'Dispatching swarm…' : 'Dispatch swarm'}
                  </button>
                  <span className="btn-hint">Splits your prompt across all 5 agents</span>
                </div>
              </div>
            </div>

            <div className="panel sunken">
              <div className="panel-head">
                <div className="panel-title">Build logstream</div>
                <span className="badge ok">Live</span>
              </div>
              <div className="console">
                {agentLogs.length === 0 && (
                  <div className="log-row"><span className="log-msg">Dispatch the swarm to stream the build.</span></div>
                )}
                {agentLogs.map((log, index) => (
                  <div key={index} className="log-row">
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-agent">{log.agent}</span>
                    <span className="log-msg">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <span className="field-label">Crew roster — who does what</span>
            {ROSTER.map((agent, i) => (
              <div key={i} className="roster-row">
                <div className="roster-head">
                  <span className="roster-name">{agent.name}</span>
                  <span className="badge ok">Online</span>
                </div>
                <div className="roster-role">{agent.role}</div>
                <p className="roster-desc">{agent.desc}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: WORKBENCH */}
      {activeTab === 'workbench' && (
        <div className="grid cols-side-main">

          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">Preview</div>
              <span className="panel-note">{cfg.deviceLabel}</span>
            </div>
            {renderPreview()}
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Code size={15} />
                Generated {cfg.lang} — ready to paste into your project
              </div>
              <button
                type="button"
                className="btn quiet"
                onClick={() => handleCopyCode(cfg.sample, 'sample')}
              >
                {copiedIndex === 'sample' ? <Check size={14} /> : <Copy size={14} />}
                {copiedIndex === 'sample' ? 'Copied' : `Copy ${cfg.lang}`}
              </button>
            </div>
            <pre className="codeblock"><code>{cfg.sample}</code></pre>
          </div>

        </div>
      )}

      {/* TAB 3: CLI BRIDGE */}
      {activeTab === 'cli' && (
        <div className="stack">
          <div>
            <span className="field-label">{cfg.label} preset commands — click to run</span>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {cfg.cli.map((cmd, i) => (
                <button key={i} type="button" className="btn quiet" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, border: '1px solid var(--seam)' }} onClick={() => runPresetCli(cmd)}>
                  $ {cmd}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <input
              type="text"
              className="field"
              aria-label="Custom CLI command"
              placeholder="Type a command and hit Enter"
              value={cliCommand}
              onChange={(e) => setCliCommand(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runPresetCli(cliCommand); }}
            />
            <button type="button" className="btn primary" onClick={() => runPresetCli(cliCommand)}>
              <Play size={14} />
              Run command
            </button>
          </div>

          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">
                <Terminal size={15} />
                Execution stream
              </div>
              <span className="panel-note">stdout</span>
            </div>
            <div className="console" style={{ maxHeight: '260px' }}>
              {cliOutput.map((line, idx) => (
                <div key={idx} style={{ whiteSpace: 'pre-wrap', color: line.startsWith('$') ? 'var(--amber)' : 'var(--frost-2)' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SKILL MATRIX */}
      {activeTab === 'skills' && (
        <div className="grid cols-4">
          {[
            {
              title: 'Full-stack CLI',
              skill: 'build-cli',
              desc: 'SDKs, emulators/simulators, dev servers, and doc search across every platform.',
              action: 'moltagent docs search'
            },
            {
              title: 'Antigravity Guide',
              skill: 'antigravity-guide',
              desc: 'Guide to AGY 2.0, IDE extensions, subagent orchestration, and sidecars.',
              action: 'https://antigravity.google/docs'
            },
            {
              title: 'Slash Commands',
              skill: '/goal /schedule /browser',
              desc: 'Execute autonomous long-running agent tasks, timers, and browser automation.',
              action: '/goal "Build my app"'
            },
            {
              title: 'Subagent Engine',
              skill: 'invoke_subagent',
              desc: 'Spawn isolated Pro/Flash subagent workflows with clean Git worktrees.',
              action: 'invoke_subagent({ model: "pro" })'
            }
          ].map((item, index) => (
            <div key={index} className="panel">
              <div className="panel-title" style={{ marginBottom: '2px' }}>{item.title}</div>
              <div className="panel-note" style={{ textAlign: 'left', marginBottom: 'var(--sp-2)' }}>skill: {item.skill}</div>
              <p className="panel-sub">{item.desc}</p>
              <div className="codeblock" style={{ maxHeight: 'none', padding: '8px 10px', whiteSpace: 'pre-wrap' }}>{item.action}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
