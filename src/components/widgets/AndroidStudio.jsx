import React, { useState } from 'react';
import { 
  Smartphone, 
  Cpu, 
  Terminal, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Code, 
  Layers, 
  Zap, 
  Bot, 
  RefreshCw, 
  Download, 
  Search, 
  Command,
  Flame,
  ShieldAlert,
  Server
} from 'lucide-react';

export default function AndroidStudio({ setActiveAgents, activeAgents, firebaseError }) {
  const [activeTab, setActiveTab] = useState('agent-party');
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Multi-Agent Task Dispatch State
  const [promptInput, setPromptInput] = useState('Build a futuristic dark-mode Android App for real-time AI Agent monitoring using Jetpack Compose');
  const [isBuilding, setIsBuilding] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { agent: 'Antigravity', color: '#00F0FF', time: '06:00:10', msg: 'System initialized. Multi-agent environment ready with Hermes, Grok Build, Devin, and Claude Code.' },
    { agent: 'Claude Code', color: '#FF9900', time: '06:00:12', msg: 'Analyzed project architecture. Standardizing on Clean Architecture + Jetpack Compose + Hilt.' },
    { agent: 'Grok Build', color: '#00FF66', time: '06:00:15', msg: 'Gradle dependencies cached. Speed optimizations applied for R8 & Kotlin Symbol Processing.' },
    { agent: 'Devin', color: '#A855F7', time: '06:00:18', msg: 'Configured Android Emulator API 34. ADB connection established.' },
    { agent: 'Hermes', color: '#38BDF8', time: '06:00:20', msg: 'Awaiting background execution workflow tasks.' }
  ]);

  // CLI Command Terminal State
  const [cliCommand, setCliCommand] = useState('android docs search --query="Jetpack Compose LazyColumn"');
  const [cliOutput, setCliOutput] = useState([
    '[Android CLI Specialist] Ready. Enter an android command or select a preset below.'
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun AntigravityAgentCard(
    agentName: String,
    role: String,
    status: String,
    accentColor: Color
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF12121A)
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
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = role,
                    color = Color.Gray,
                    fontSize = 12.sp
                )
            }
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = accentColor.copy(alpha = 0.2f),
                border = BorderStroke(1.dp, accentColor)
            ) {
                Text(
                    text = status.uppercase(),
                    color = accentColor,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }
        }
    }
}`;

  const handleRunAgentParty = () => {
    if (isBuilding) return;
    setIsBuilding(true);
    
    const steps = [
      { agent: 'Antigravity', color: '#00F0FF', msg: `Decomposing prompt: "${promptInput.substring(0, 45)}..." into sub-tasks.` },
      { agent: 'Claude Code', color: '#FF9900', msg: 'Generating Modular UI Specs & Clean Architecture state models.' },
      { agent: 'Grok Build', color: '#00FF66', msg: 'Compiling Jetpack Compose UI component trees with maximum parallelization.' },
      { agent: 'Devin', color: '#A855F7', msg: 'Running Android JUnit & UI Journey tests on simulated Pixel 7 AVD.' },
      { agent: 'Hermes', color: '#38BDF8', msg: 'Deploying APK release build. All 5 AI Agents synchronized successfully! 🚀' }
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
              color: '#00F0FF',
              scale: 0.35,
              speed: 0.1,
              speedOffset: Math.random() * Math.PI
            };
            setActiveAgents([...activeAgents, newAgent]);
          }
        }
      }, (index + 1) * 900);
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
      `[EXECUTING] Running via Android CLI Specialists...`
    ]);

    setTimeout(() => {
      let result = '';
      if (cmd.includes('sdk list')) {
        result = `Installed packages:\n  - platforms;android-34 (API Level 34)\n  - build-tools;34.0.0\n  - platform-tools (ADB v35.0.1)\n  - system-images;android-34;google_apis;x86_64`;
      } else if (cmd.includes('emulator list')) {
        result = `Available Android Virtual Devices (AVDs):\n  1. Pixel_7_Pro_API_34 (x86_64, Android 14.0)\n  2. Pixel_Fold_API_34 (x86_64, Android 14.0)`;
      } else if (cmd.includes('layout')) {
        result = `{\n  "package": "com.antigravity.swarm",\n  "activity": ".MainActivity",\n  "root": {\n    "type": "ComposeView",\n    "children": [\n      { "type": "AntigravityAgentCard", "bounds": "[0,0][1080,240]" }\n    ]\n  }\n}`;
      } else {
        result = `Command completed successfully with status code 0.\nDocumentation search returned 4 relevant Jetpack Compose guides.`;
      }
      setCliOutput(prev => [...prev, result]);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(168,85,247,0.08) 100%)',
        border: '1px solid rgba(0,240,255,0.2)',
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
            background: 'rgba(0,240,255,0.15)',
            border: '1px solid #00F0FF',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Smartphone size={24} color="#00F0FF" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ANTIGRAVITY ANDROID AGENT PARTY
              <span style={{ fontSize: '0.65rem', background: '#00F0FF', color: '#000', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                5 AGENTS ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
              Google Antigravity • Hermes • Grok Build • Devin • Claude Code
            </p>
          </div>
        </div>

        {/* Tab Selection & Guided Demo Button */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setActiveTab('agent-party');
              handleRunAgentParty();
            }}
            disabled={isBuilding}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FF9900 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.7rem',
              fontFamily: 'JetBrains Mono',
              fontWeight: 'bold',
              cursor: isBuilding ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(255,215,0,0.4)'
            }}
          >
            <Sparkles size={14} />
            {isBuilding ? 'DEMO RUNNING...' : '▶ START LIVE DEMO TOUR'}
          </button>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                  background: activeTab === tab.id ? 'rgba(0,240,255,0.2)' : 'transparent',
                  color: activeTab === tab.id ? '#00F0FF' : '#888',
                  border: activeTab === tab.id ? '1px solid rgba(0,240,255,0.4)' : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '0.65rem',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: SWARM PARTY DISPATCHER */}
      {activeTab === 'agent-party' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          
          {/* Main Task Input & Live Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ background: 'rgba(10,10,15,0.8)' }}>
              <div style={{ fontSize: '0.8rem', color: '#00F0FF', fontFamily: 'JetBrains Mono', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={16} />
                MULTI-AGENT ANDROID TASK DISPATCHER
              </div>
              
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  color: '#FFF',
                  padding: '12px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.8rem',
                  resize: 'none',
                  outline: 'none',
                  marginBottom: '12px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Jetpack Compose', 'Clean Architecture', 'Hilt DI', 'Coroutines'].map((tag, i) => (
                    <span key={i} style={{ fontSize: '0.6rem', color: '#AAA', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleRunAgentParty}
                  disabled={isBuilding}
                  className="button button-primary"
                  style={{
                    background: isBuilding ? '#333' : 'linear-gradient(135deg, #00F0FF 0%, #A855F7 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px'
                  }}
                >
                  {isBuilding ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
                  {isBuilding ? 'ORCHESTRATING SWARM...' : 'LAUNCH AGENT PARTY'}
                </button>
              </div>
            </div>

            {/* Live Agent Collaboration Console */}
            <div className="card" style={{ flexGrow: 1, background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(0,240,255,0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#AAA', fontFamily: 'JetBrains Mono', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>SWARM WORKFLOW LOGS</span>
                <span style={{ color: '#00F0FF' }}>LIVE FEED</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {agentLogs.map((log, index) => (
                  <div key={index} style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: `3px solid ${log.color}`,
                    fontFamily: 'JetBrains Mono',
                    fontSize: '0.72rem',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#666', minWidth: '60px' }}>[{log.time}]</span>
                    <span style={{ color: log.color, fontWeight: 'bold', minWidth: '100px' }}>{log.agent}:</span>
                    <span style={{ color: '#DDD' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Agents Roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#AAA', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
              CO-DEVELOPMENT ROSTER
            </div>

            {[
              { name: 'Google Antigravity', role: 'Master Architect & Skill Harness', color: '#00F0FF', icon: <Bot size={16} color="#00F0FF" /> },
              { name: 'Grok Build', role: 'Jetpack Compiler & Speed Optimizer', color: '#00FF66', icon: <Zap size={16} color="#00FF66" /> },
              { name: 'Devin', role: 'Full-Stack Android Engineer', color: '#A855F7', icon: <Cpu size={16} color="#A855F7" /> },
              { name: 'Claude Code', role: 'Architecture & Security Auditor', color: '#FF9900', icon: <ShieldAlert size={16} color="#FF9900" /> },
              { name: 'Hermes', role: 'Autonomous Workflow Execution', color: '#38BDF8', icon: <Server size={16} color="#38BDF8" /> }
            ].map((agent, i) => (
              <div key={i} className="card" style={{ padding: '12px', background: 'rgba(18,18,26,0.9)', borderLeft: `3px solid ${agent.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {agent.icon}
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#FFF' }}>{agent.name}</span>
                  </div>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: agent.color, boxShadow: `0 0 8px ${agent.color}` }}></span>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#888', marginTop: '6px', fontFamily: 'JetBrains Mono' }}>
                  {agent.role}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: COMPOSE WORKBENCH */}
      {activeTab === 'compose-studio' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
          
          {/* Simulated Mobile Device Preview */}
          <div className="card" style={{ background: '#09090E', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#AAA', fontFamily: 'JetBrains Mono', marginBottom: '12px' }}>
              LIVE AVD SIMULATOR (PIXEL 7)
            </div>

            {/* Mobile Phone Mockup */}
            <div style={{
              width: '240px',
              height: '420px',
              background: '#12121A',
              borderRadius: '24px',
              border: '3px solid #333',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 30px rgba(0,240,255,0.15)',
              position: 'relative'
            }}>
              {/* Notch */}
              <div style={{ width: '60px', height: '10px', background: '#000', borderRadius: '5px', alignSelf: 'center', marginBottom: '12px' }}></div>
              
              {/* Screen Content */}
              <div style={{ flexGrow: 1, background: '#0A0A10', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#FFF', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                  Antigravity Swarm
                </div>

                {['Google Antigravity', 'Grok Build', 'Devin'].map((name, i) => (
                  <div key={i} style={{ background: '#1A1A26', padding: '8px', borderRadius: '8px', borderLeft: `2px solid ${i === 0 ? '#00F0FF' : i === 1 ? '#00FF66' : '#A855F7'}` }}>
                    <div style={{ fontSize: '0.65rem', color: '#FFF', fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: '0.55rem', color: '#888' }}>Status: ONLINE • 99% Load</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jetpack Compose Kotlin Code Output */}
          <div className="card" style={{ background: 'rgba(5,5,10,0.95)', border: '1px solid rgba(0,240,255,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#00FF66', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={16} />
                JETPACK COMPOSE (KOTLIN) CODE GENERATED BY CLAUDE & GROK BUILD
              </div>

              <button
                onClick={() => handleCopyCode(composeSnippet, 'compose')}
                className="button"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.65rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedIndex === 'compose' ? <Check size={14} color="#00FF66" /> : <Copy size={14} />}
                {copiedIndex === 'compose' ? 'COPIED!' : 'COPY KOTLIN CODE'}
              </button>
            </div>

            <pre style={{
              background: '#000',
              padding: '14px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#A9DC76',
              fontFamily: 'JetBrains Mono',
              overflowX: 'auto',
              maxHeight: '340px'
            }}>
              <code>{composeSnippet}</code>
            </pre>
          </div>

        </div>
      )}

      {/* TAB 3: ANDROID CLI & ADB BRIDGE */}
      {activeTab === 'cli-bridge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* CLI Preset Buttons */}
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
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#00F0FF',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontFamily: 'JetBrains Mono',
                  cursor: 'pointer'
                }}
              >
                $ {cmd.substring(0, 25)}...
              </button>
            ))}
          </div>

          {/* Interactive Command Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={cliCommand}
              onChange={(e) => setCliCommand(e.target.value)}
              style={{
                flexGrow: 1,
                background: '#000',
                border: '1px solid rgba(0,240,255,0.3)',
                borderRadius: '6px',
                color: '#00FF66',
                padding: '10px 14px',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => runPresetCli(cliCommand)}
              className="button button-primary"
              style={{ background: '#00F0FF', color: '#000', fontWeight: 'bold' }}
            >
              RUN CMD
            </button>
          </div>

          {/* Output Terminal Console */}
          <div className="card" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
              ANDROID CLI EXECUTION STREAM (STDOUT / STDERR)
            </div>
            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {cliOutput.map((line, idx) => (
                <div key={idx} style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: line.startsWith('$') ? '#00F0FF' : '#00FF66', whiteSpace: 'pre-wrap' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ANTIGRAVITY SKILL MATRIX */}
      {activeTab === 'antigravity-skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            {
              title: 'Android CLI Specialist',
              skill: 'android-cli',
              desc: 'SDK downloads, device emulators, layout inspector, and doc search.',
              action: 'android docs search'
            },
            {
              title: 'Antigravity Guide',
              skill: 'antigravity-guide',
              desc: 'Deep guide to AGY 2.0, IDE extensions, subagent orchestration, and sidecars.',
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
            <div key={index} className="card" style={{ background: 'rgba(15,15,22,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00F0FF', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.65rem', color: '#A855F7', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>SKILL: {item.skill}</div>
              <p style={{ fontSize: '0.72rem', color: '#AAA', marginBottom: '12px' }}>{item.desc}</p>
              <div style={{ fontSize: '0.65rem', background: '#000', padding: '6px 8px', borderRadius: '4px', color: '#00FF66', fontFamily: 'JetBrains Mono' }}>
                {item.action}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
