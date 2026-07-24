import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Trail, Html } from '@react-three/drei';
import * as THREE from 'three';

const AgentNode = ({ agent }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!agent.position) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = agent.position[1] + Math.sin(t * agent.speed + agent.speedOffset) * 0.5;
    ref.current.position.x = agent.position[0] + Math.cos(t * agent.speed * 0.5 + agent.speedOffset) * 0.2;
  });

  if (!agent.position) return null;

  return (
    <Trail width={0.2} length={2} color={agent.color} attenuation={(t) => t * t}>
      <Sphere 
        ref={ref} 
        position={agent.position} 
        args={[agent.scale, 16, 16]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <meshStandardMaterial
          color={hovered ? '#FFFFFF' : agent.color}
          emissive={agent.color}
          emissiveIntensity={hovered ? 1 : 0.5}
          roughness={0.4}
          metalness={0.9}
        />
        {hovered && (
          <Html distanceFactor={15} center zIndexRange={[100, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.6rem',
              color: '#FFF',
              minWidth: '150px',
              pointerEvents: 'none',
              textTransform: 'uppercase'
            }}>
              <div style={{ color: agent.color, marginBottom: '4px', fontWeight: 'bold' }}>{agent.id}</div>
              <div style={{ color: '#888', marginBottom: '2px' }}>TYPE: {agent.type}</div>
              <div style={{ color: '#888', marginBottom: '2px' }}>TASK: {agent.task}</div>
              <div style={{ color: '#888' }}>LOAD: {agent.load}</div>
            </div>
          </Html>
        )}
      </Sphere>
    </Trail>
  );
};

const ConstellationLines = ({ nodes }) => {
  const points = useMemo(() => {
    const pts = [];
    if (!nodes || nodes.length < 2) return pts;
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].position && nodes[i+1].position) {
        pts.push(new THREE.Vector3(...nodes[i].position));
        pts.push(new THREE.Vector3(...nodes[i+1].position));
      }
    }
    if (nodes.length > 2 && nodes[0].position && nodes[nodes.length - 1].position) {
      pts.push(new THREE.Vector3(...nodes[nodes.length - 1].position));
      pts.push(new THREE.Vector3(...nodes[0].position));
    }
    return pts;
  }, [nodes]);

  if (points.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.05} />
    </lineSegments>
  );
};

export default function Canvas3D({ constellationMode, activeAgents }) {
  // Base structural nodes depending on mode
  const baseNodes = useMemo(() => {
    if (constellationMode === 'android-party') {
      return [
        { id: 'ANTIGRAVITY-CORE', type: 'Master Architect', task: 'Skill & Subagent Harness', load: '99%', position: [0, 2, 0], color: '#00F0FF', scale: 0.6, speed: 0.1, speedOffset: 0 },
        { id: 'GROK-BUILD', type: 'Jetpack Compiler', task: 'Kotlin Optimization', load: '95%', position: [-4, 1, 2], color: '#00FF66', scale: 0.45, speed: 0.15, speedOffset: 1 },
        { id: 'DEVIN-ENGINEER', type: 'Full-Stack Android', task: 'ADB & JUnit Testing', load: '92%', position: [4, -1, -2], color: '#A855F7', scale: 0.45, speed: 0.12, speedOffset: 2 },
        { id: 'CLAUDE-CODE', type: 'Compose Auditor', task: 'Security & UI Specs', load: '88%', position: [-3, -2, -1], color: '#FF9900', scale: 0.45, speed: 0.14, speedOffset: 3 },
        { id: 'HERMES-WORKER', type: 'Workflow Execution', task: 'Autonomous Tasks', load: '90%', position: [3, 2, 1], color: '#38BDF8', scale: 0.45, speed: 0.13, speedOffset: 4 },
        { id: 'ANDROID-APP-TARGET', type: 'APK Build', task: 'Jetpack Compose App', load: '100%', position: [0, -3, 0], color: '#FFD700', scale: 0.5, speed: 0.08, speedOffset: 5 },
        { id: 'PIXEL-7-AVD', type: 'Emulator Device', task: 'ADB Stream Connected', load: '60%', position: [5, 0, 3], color: '#10B981', scale: 0.35, speed: 0.1, speedOffset: 2.5 }
      ];
    }

    if (constellationMode === 'mecha-party') {
      return [
        { id: 'MECHA-PILOT', type: 'Grok Leader', task: 'Consensus Synthesis', load: '99%', position: [0, 3, 0], color: '#FFD700', scale: 0.65, speed: 0.1, speedOffset: 0 },
        { id: 'MECHA-HARPER', type: 'Researcher', task: 'gBrain Truth Ingest', load: '94%', position: [-5, 1, 2], color: '#38BDF8', scale: 0.45, speed: 0.14, speedOffset: 1 },
        { id: 'MECHA-BENJAMIN', type: 'Critic & Logic', task: 'Stress Testing', load: '91%', position: [5, -1, -2], color: '#FF9900', scale: 0.45, speed: 0.12, speedOffset: 2 },
        { id: 'MECHA-LUCAS', type: 'Executor', task: 'Code Generation', load: '96%', position: [-3, -2, -1], color: '#00FF66', scale: 0.45, speed: 0.15, speedOffset: 3 },
        { id: 'GBRAIN-MEMORY-CORE', type: 'Grounded Memory', task: 'Vector Truth Bank', load: '100%', position: [0, -3, 0], color: '#A855F7', scale: 0.55, speed: 0.08, speedOffset: 4 },
        { id: 'CODEX-SWARM-HUB', type: '50-Agent Army', task: 'Parallel Repo Audits', load: '98%', position: [4, 2, 2], color: '#00F0FF', scale: 0.5, speed: 0.13, speedOffset: 5 }
      ];
    }

    const count = constellationMode === 'cinematic' ? 12 : constellationMode === 'x-growth' ? 24 : 12;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: `core-anchor-${i}`,
        type: 'Anchor',
        task: 'Maintaining Structure',
        load: '1%',
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15],
        color: '#333333',
        scale: 0.1,
        speed: 0.05,
        speedOffset: Math.random() * Math.PI * 2,
      });
    }
    // Main Gravity Core
    items.push({
      id: 'AETHER-CORE',
      type: 'Nexus',
      task: 'Routing intel',
      load: '5%',
      position: [0, 0, 0],
      color: '#FFFFFF',
      scale: 0.5,
      speed: 0.05,
      speedOffset: 0,
    });
    return items;
  }, [constellationMode]);

  // Combine static anchors with dynamic active agents
  const allNodes = [...baseNodes, ...(activeAgents || [])];

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
        
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.2} />
        
        <group>
          {allNodes.map((agent, i) => (
            <AgentNode key={agent.id || i} agent={agent} />
          ))}
          <ConstellationLines nodes={allNodes} />
        </group>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          maxDistance={40}
          minDistance={2}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </div>
  );
}
