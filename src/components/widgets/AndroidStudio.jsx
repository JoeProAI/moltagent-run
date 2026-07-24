import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Play,
  Copy,
  Check,
  Code,
  Command,
  Flame,
  RefreshCw
} from 'lucide-react';

export default function AndroidStudio({ setActiveAgents, activeAgents }) {
  const [activeTab, setActiveTab] = useState('agent-party');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Multi-Agent Task Dispatch State
  const [promptInput, setPromptInput] = useState('Build a clean, high-performance Jetpack Compose Android App with Hilt DI, ViewModel, and Coroutines StateFlow');
  const [isBuilding, setIsBuilding] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { agent: 'Antigravity', time: '08:45:10', msg: 'Subagent engine ready. Skill matrix loaded (android-cli, antigravity-guide).' },
    { agent: 'Claude Code', time: '08:45:12', msg: 'Clean Architecture state flow spec created. Standardizing on Jetpack Compose Material 3.' },
    { agent: 'Grok Build', time: '08:45:15', msg: 'Gradle 8.7 daemon initialized. Kotlin Symbol Processing (KSP) cache warm.' },
    { agent: 'Devin', time: '08:45:18', msg: 'Android Virtual Device (Pixel 7 AVD API 34) connected via ADB.' },
    { agent: 'Hermes', time: '08:45:20', msg: 'Autonomous release pipeline standing by.' }
  ]);

  // CLI Command Terminal State
  const [cliCommand, setCliCommand] = useState('android docs search --query="Jetpack Compose LazyColumn"');
  const [cliOutput, setCliOutput] = useState([
    '[Android CLI Specialist] Ready. Select a command action below or enter a custom android CLI query.'
  ]);

  // Compose Workbench Sample Code
  const composeSnippet = `package com.moltagent.swarm.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MoltAgentCard(
    agentName: String,
    role: String,
    status: String
) {
    Card(
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF1D1810)
        ),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = agentName,
                    color = Color(0xFFEFE7D6),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = role,
                    color = Color(0xFFB0A488),
                    fontSize = 12.sp
                )
            }
            Surface(
                shape = RoundedCornerShape(4.dp),
                color = Color(0xFF2C2416)
            ) {
                Text(
                    text = status.uppercase(),
                    color = Color(0xFFE8A832),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }
    }
}`;

  const handleRunAgentParty = () => {
    if (isBuilding) return;
    setIsBuilding(true);

    const steps = [
      { agent: 'Antigravity', msg: `Decomposing prompt: "${promptInput.substring(0, 45)}..." into subagent tasks.` },
      { agent: 'Claude Code', msg: 'Synthesizing Compose UI state trees & Hilt dependency modules.' },
      { agent: 'Grok Build', msg: 'Compiling Kotlin source files with parallel Gradle R8 optimizations.' },
      { agent: 'Devin', msg: 'Executing ADB journey tests on Pixel 7 API 34 AVD.' },
      { agent: 'Hermes', msg: 'APK build validated. All 5 agents synchronized on MoltAgent.run.' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString();
        setAgentLogs(prev => [...prev, { ...step, time: timeStr }]);
        if (index === steps.length - 1) {
          setIsBuilding(false);
          if (setActiveAgents && activeAgents) {
            const newAgent = {
              id: `Android-Swarm-${Date.now().toString().slice(-4)}`,
              type: 'Android Specialist',
              task: promptInput.substring(0, 20),
              load: '98%',
              position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8],
              color: '#E8A832',
              scale: 0.35,
              speed: 0.1,
              speedOffset: Math.random() * Math.PI
            };
            setActiveAgents([...activeAgents, newAgent]);
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
    setCliCommand(cmd);
    setCliOutput(prev => [
      ...prev,
      `\n$ ${cmd}`,
      `[EXECUTING VIA ANDROID CLI SPECIALIST...]`
    ]);

    setTimeout(() => {
      let result = '';
      if (cmd.includes('sdk list')) {
        result = `Installed Android SDK Packages:\n  + platforms;android-34 (Android 14.0)\n  + build-tools;34.0.0\n  + platform-tools (ADB v35.0.1)\n  + system-images;android-34;google_apis;x86_64`;
      } else if (cmd.includes('emulator list')) {
        result = `Available Android Virtual Devices (AVD):\n  1. Pixel_7_Pro_API_34 (x86_64, Android 14.0 - READY)\n  2. Pixel_Fold_API_34 (x86_64, Android 14.0 - STANDBY)`;
      } else if (cmd.includes('layout')) {
        result = `{\n  "package": "com.moltagent.swarm",\n  "activity": ".MainActivity",\n  "root": {\n    "type": "ComposeView",\n    "children": [\n      { "type": "MoltAgentCard", "bounds": "[0,0][1080,240]", "visible": true }\n    ]\n  }\n}`;
      } else {
        result = `Command executed cleanly (exit code 0).\nAndroid Documentation query returned 4 authoritative API references for Jetpack Compose.`;
      }
      setCliOutput(prev => [...prev, result]);
    }, 550);
  };

  const roster = [
    { name: 'Antigravity', role: 'Master architect', desc: 'Decomposes your prompt and leases subagents.' },
    { name: 'Grok Build', role: 'Jetpack compiler', desc: 'Gradle caching and KSP optimization.' },
    { name: 'Devin', role: 'Full-stack engineer', desc: 'AVD emulator tests and ADB layout inspection.' },
    { name: 'Claude Code', role: 'Architecture auditor', desc: 'Compose state trees and Hilt modules.' },
    { name: 'Hermes', role: 'Workflow executor', desc: 'Background release and deployment scripts.' }
  ];

  return (
    <div className="module">

      <div className="masthead">
        <div>
          <div className="masthead-eyebrow">S1 · Android swarm</div>
          <h2 className="masthead-title">Five agents build your Android app in parallel</h2>
          <p className="masthead-sub">
            Describe the app once. Antigravity, Grok Build, Devin, Claude Code and Hermes split the work:
            architecture, compilation, device testing, audit, release.
          </p>
        </div>
        <div className="masthead-actions">
          <div className="tabset" role="tablist">
            {[
              { id: 'agent-party', label: 'DISPATCH', icon: <Flame size={13} /> },
              { id: 'compose-studio', label: 'COMPOSE WORKBENCH', icon: <Code size={13} /> },
              { id: 'cli-bridge', label: 'CLI & ADB', icon: <Terminal size={13} /> },
              { id: 'antigravity-skills', label: 'SKILL MATRIX', icon: <Sparkles size={13} /> }
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

      {/* TAB 1: SWARM DISPATCHER */}
      {activeTab === 'agent-party' && (
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

              <label className="field-label" htmlFor="android-prompt">Describe the app to build</label>
              <textarea
                id="android-prompt"
                className="textarea"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {['Jetpack Compose', 'Clean Architecture', 'Hilt DI', 'Coroutines'].map((tag, i) => (
                    <span key={i} className="badge">{tag}</span>
                  ))}
                </div>

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
            {roster.map((agent, i) => (
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

      {/* TAB 2: COMPOSE WORKBENCH */}
      {activeTab === 'compose-studio' && (
        <div className="grid cols-side-main">

          <div className="panel sunken">
            <div className="panel-head">
              <div className="panel-title">AVD preview</div>
              <span className="panel-note">Pixel 7 · API 34</span>
            </div>

            <div className="phone-frame">
              <div className="phone-screen">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.72rem', color: 'var(--bone)', borderBottom: '1px solid var(--seam)', paddingBottom: '6px' }}>
                  MoltAgent Swarm Studio
                </div>
                {['Antigravity', 'Grok Build', 'Devin'].map((name, i) => (
                  <div key={i} className="roster-row" style={{ padding: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--bone)', fontWeight: 700 }}>{name}</div>
                    <div style={{ fontSize: '0.56rem', color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}>ONLINE</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Code size={15} />
                Generated Kotlin — ready to paste into your project
              </div>
              <button
                type="button"
                className="btn quiet"
                onClick={() => handleCopyCode(composeSnippet, 'compose')}
              >
                {copiedIndex === 'compose' ? <Check size={14} /> : <Copy size={14} />}
                {copiedIndex === 'compose' ? 'Copied' : 'Copy Kotlin'}
              </button>
            </div>

            <pre className="codeblock"><code>{composeSnippet}</code></pre>
          </div>

        </div>
      )}

      {/* TAB 3: ANDROID CLI & ADB BRIDGE */}
      {activeTab === 'cli-bridge' && (
        <div className="stack">

          <div>
            <span className="field-label">Preset commands — click to run</span>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {[
                'android sdk list --all',
                'android emulator list',
                'android layout --pretty',
                'android docs search --query="Compose State"',
                'android create empty-activity --name="SwarmApp"'
              ].map((cmd, i) => (
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
              aria-label="Custom android CLI command"
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
                <div key={idx} style={{ whiteSpace: 'pre-wrap', color: line.startsWith('$') ? 'var(--amber)' : 'var(--bone-2)' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: SKILL MATRIX */}
      {activeTab === 'antigravity-skills' && (
        <div className="grid cols-4">
          {[
            {
              title: 'Android CLI Specialist',
              skill: 'android-cli',
              desc: 'SDK management, device emulators, UI layout tree inspection, and doc search.',
              action: 'android docs search'
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
              action: '/goal "Build Android App"'
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
