import React, { useState } from 'react';
import { 
  Smartphone, 
  Terminal, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Code, 
  Command,
  Flame,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AndroidStudio({ setActiveAgents, activeAgents }) {
  const [activeTab, setActiveTab] = useState('agent-party');
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Multi-Agent Task Dispatch State
  const [promptInput, setPromptInput] = useState('Build a clean, high-performance Jetpack Compose Android App with Hilt DI, ViewModel, and Coroutines StateFlow');
  const [isBuilding, setIsBuilding] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { agent: 'Google Antigravity', time: '08:45:10', msg: 'Subagent engine ready. Skill matrix loaded (android-cli, antigravity-guide).' },
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
  const composeSnippet = `package com.antigravity.swarm.ui

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
fun AntigravityAgentCard(
    agentName: String,
    role: String,
    status: String
) {
    Card(
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF14161F)
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
                    color = Color.White,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = role,
                    color = Color(0xFF94A3B8),
                    fontSize = 12.sp
                )
            }
            Surface(
                shape = RoundedCornerShape(4.dp),
                color = Color(0xFF1F222E)
            ) {
                Text(
                    text = status.uppercase(),
                    color = Color.White,
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
      { agent: 'Google Antigravity', msg: `Decomposing prompt: "${promptInput.substring(0, 45)}..." into subagent tasks.` },
      { agent: 'Claude Code', msg: 'Synthesizing Compose UI state trees & Hilt dependency modules.' },
      { agent: 'Grok Build', msg: 'Compiling Kotlin source files with parallel Gradle R8 optimizations.' },
      { agent: 'Devin', msg: 'Executing ADB journey tests on Pixel 7 API 34 AVD.' },
      { agent: 'Hermes', msg: 'APK build validated successfully! All 5 Agents synchronized on MoltAgent.run 🚀' }
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
              color: '#FFFFFF',
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
        result = `Installed Android SDK Packages:\n  ✓ platforms;android-34 (Android 14.0)\n  ✓ build-tools;34.0.0\n  ✓ platform-tools (ADB v35.0.1)\n  ✓ system-images;android-34;google_apis;x86_64`;
      } else if (cmd.includes('emulator list')) {
        result = `Available Android Virtual Devices (AVD):\n  1. Pixel_7_Pro_API_34 (x86_64, Android 14.0 - READY)\n  2. Pixel_Fold_API_34 (x86_64, Android 14.0 - STANDBY)`;
      } else if (cmd.includes('layout')) {
        result = `{\n  "package": "com.antigravity.swarm",\n  "activity": ".MainActivity",\n  "root": {\n    "type": "ComposeView",\n    "children": [\n      { "type": "AntigravityAgentCard", "bounds": "[0,0][1080,240]", "visible": true }\n    ]\n  }\n}`;
      } else {
        result = `Command executed cleanly (exit code 0).\nAndroid Documentation query returned 4 authoritative API references for Jetpack Compose.`;
      }
      setCliOutput(prev => [...prev, result]);
    }, 550);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
      
      {/* Sleek Header Banner */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #1F222E',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Smartphone size={20} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              MOLTAGENT ANDROID AGENT PARTY
              <span style={{ fontSize: '0.62rem', background: '#1F222E', color: '#FFF', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
                5 AGENTS SYNCHRONIZED
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              Google Antigravity • Hermes • Grok Build • Devin • Claude Code
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '4px', background: '#0E0F14', padding: '4px', borderRadius: '6px', border: '1px solid #1F222E' }}>
          {[
            { id: 'agent-party', label: 'SWARM PARTY', icon: <Flame size={14} /> },
            { id: 'compose-studio', label: 'COMPOSE WORKBENCH', icon: <Code size={14} /> },
            { id: 'cli-bridge', label: 'ANDROID CLI & ADB', icon: <Terminal size={14} /> },
            { id: 'antigravity-skills', label: 'SKILL MATRIX', icon: <Sparkles size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#1F222E' : 'transparent',
                color: activeTab === tab.id ? '#FFF' : '#64748B',
                border: '1px solid transparent',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SWARM PARTY DISPATCHER */}
      {activeTab === 'agent-party' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#FFF', fontFamily: 'var(--font-mono)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Command size={16} />
                  MULTI-AGENT ANDROID TASK DISPATCHER
                </div>
                <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                  ACTION: Input prompt & launch swarm
                </span>
              </div>
              
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: '#090A0E',
                  border: '1px solid #1F222E',
                  borderRadius: '6px',
                  color: '#FFF',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '12px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Jetpack Compose', 'Clean Architecture', 'Hilt DI', 'Coroutines'].map((tag, i) => (
                    <span key={i} style={{ fontSize: '0.62rem', color: '#94A3B8', background: '#0E0F14', padding: '3px 8px', borderRadius: '4px', border: '1px solid #1F222E' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleRunAgentParty}
                  disabled={isBuilding}
                  className="button button-primary"
                  style={{
                    background: isBuilding ? '#1F222E' : '#FFF',
                    color: isBuilding ? '#94A3B8' : '#000',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    fontSize: '0.75rem'
                  }}
                >
                  {isBuilding ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
                  {isBuilding ? 'DISPATCHING SWARM...' : 'LAUNCH AGENT PARTY'}
                </button>
              </div>
            </div>

            {/* Live Agent Collaboration Console */}
            <div className="card" style={{ flexGrow: 1, background: '#090A0E' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>REAL-TIME WORKFLOW LOGSTREAM</span>
                <span style={{ color: '#94A3B8' }}>LIVE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                {agentLogs.map((log, index) => (
                  <div key={index} style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: '3px solid #334155',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#64748B', minWidth: '60px' }}>[{log.time}]</span>
                    <span style={{ color: '#FFF', fontWeight: '700', minWidth: '130px' }}>{log.agent}:</span>
                    <span style={{ color: '#CBD5E1' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Agents Roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              AGENT ROSTER & RESPONSIBILITIES
            </div>

            {[
              { name: 'Google Antigravity', role: 'Master Architect', desc: 'Subagent leasing & skill execution.' },
              { name: 'Grok Build', role: 'Jetpack Compiler', desc: 'Gradle caching & KSP optimization.' },
              { name: 'Devin', role: 'Full-Stack Engineer', desc: 'AVD emulator tests & ADB layout inspection.' },
              { name: 'Claude Code', role: 'Architecture Auditor', desc: 'Compose state trees & Hilt modules.' },
              { name: 'Hermes', role: 'Workflow Execution', desc: 'Background release & deployment scripts.' }
            ].map((agent, i) => (
              <div key={i} className="card" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFF' }}>{agent.name}</span>
                  <span style={{ fontSize: '0.58rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', background: '#0E0F14', padding: '2px 6px', borderRadius: '4px', border: '1px solid #1F222E' }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                  {agent.role}
                </div>
                <p style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '2px' }}>{agent.desc}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: COMPOSE WORKBENCH */}
      {activeTab === 'compose-studio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px' }}>
          
          <div className="card" style={{ background: '#090A0E', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              LIVE AVD SIMULATOR (PIXEL 7 API 34)
            </div>

            <div style={{
              width: '220px',
              height: '380px',
              background: '#14161F',
              borderRadius: '20px',
              border: '2px solid #1F222E',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '50px', height: '8px', background: '#000', borderRadius: '4px', alignSelf: 'center', marginBottom: '10px' }}></div>
              
              <div style={{ flexGrow: 1, background: '#060608', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#FFF', borderBottom: '1px solid #1F222E', paddingBottom: '4px' }}>
                  MoltAgent Swarm Studio
                </div>

                {['Google Antigravity', 'Grok Build', 'Devin'].map((name, i) => (
                  <div key={i} style={{ background: '#0E0F14', padding: '8px', borderRadius: '6px', borderLeft: '2px solid #334155' }}>
                    <div style={{ fontSize: '0.62rem', color: '#FFF', fontWeight: '700' }}>{name}</div>
                    <div style={{ fontSize: '0.55rem', color: '#64748B' }}>Status: ONLINE</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ background: '#090A0E', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#FFF', fontFamily: 'var(--font-mono)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={16} />
                BUILDABLE KOTLIN JETPACK COMPOSE CODE
              </div>

              <button
                onClick={() => handleCopyCode(composeSnippet, 'compose')}
                className="button"
                style={{ background: '#1F222E', color: '#FFF', fontSize: '0.65rem', padding: '6px 12px' }}
              >
                {copiedIndex === 'compose' ? <Check size={14} color="#FFF" /> : <Copy size={14} />}
                {copiedIndex === 'compose' ? 'COPIED!' : 'COPY KOTLIN CODE'}
              </button>
            </div>

            <pre style={{
              background: '#060608',
              padding: '14px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#CBD5E1',
              fontFamily: 'var(--font-mono)',
              overflowX: 'auto',
              maxHeight: '320px'
            }}>
              <code>{composeSnippet}</code>
            </pre>
          </div>

        </div>
      )}

      {/* TAB 3: ANDROID CLI & ADB BRIDGE */}
      {activeTab === 'cli-bridge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              'android sdk list --all',
              'android emulator list',
              'android layout --pretty',
              'android docs search --query="Compose State"',
              'android create empty-activity --name="SwarmApp"'
            ].map((cmd, i) => (
              <button
                key={i}
                onClick={() => runPresetCli(cmd)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid #1F222E',
                  color: '#FFF',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                $ {cmd}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={cliCommand}
              onChange={(e) => setCliCommand(e.target.value)}
              style={{
                flexGrow: 1,
                background: '#090A0E',
                border: '1px solid #1F222E',
                borderRadius: '6px',
                color: '#FFF',
                padding: '10px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => runPresetCli(cliCommand)}
              className="button button-primary"
              style={{ padding: '0 20px' }}
            >
              RUN CMD
            </button>
          </div>

          <div className="card" style={{ background: '#090A0E', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              ANDROID CLI EXECUTION STREAM (STDOUT)
            </div>
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {cliOutput.map((line, idx) => (
                <div key={idx} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: line.startsWith('$') ? '#FFF' : '#94A3B8', whiteSpace: 'pre-wrap' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ANTIGRAVITY SKILL MATRIX */}
      {activeTab === 'antigravity-skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
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
            <div key={index} className="card">
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>SKILL: {item.skill}</div>
              <p style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '12px' }}>{item.desc}</p>
              <div style={{ fontSize: '0.65rem', background: '#090A0E', padding: '6px 8px', borderRadius: '4px', color: '#CBD5E1', fontFamily: 'var(--font-mono)', border: '1px solid #1F222E' }}>
                {item.action}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
