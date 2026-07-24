import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Canvas3D from './components/Canvas3D';
import MouseConstellation from './components/MouseConstellation';
import AndroidStudio from './components/widgets/AndroidStudio';
import CarapaceFirewall from './components/widgets/CarapaceFirewall';
import MechaRun from './components/widgets/MechaRun';
import AgentFactory from './components/widgets/AgentFactory';
import XGrowth from './components/widgets/XGrowth';
import NOESISBridge from './components/widgets/NOESISBridge';
import { db, collection, onSnapshot, doc, setDoc } from './firebase';

function App() {
  const [activeWidget, setActiveWidget] = useState('android-studio');
  const [constellation, setConstellation] = useState('android-party');
  const [activeAgents, setActiveAgents] = useState([]);
  const [daytonaCredits, setDaytonaCredits] = useState(19842);
  const [isSynced, setIsSynced] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);

  // Firestore Real-time Sync
  useEffect(() => {
    try {
      // Listen to active agents swarm
      const agentsRef = collection(db, 'activeAgents');
      const unsubscribeAgents = onSnapshot(agentsRef, (snapshot) => {
        const agentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActiveAgents(agentsData);
      }, (error) => {
        console.error("Firebase read error (Needs real config): ", error);
        setFirebaseError(true);
      });

      // Listen to system state (Daytona & NOESIS)
      const systemRef = doc(db, 'system', 'core');
      const unsubscribeSystem = onSnapshot(systemRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.daytonaCredits !== undefined) setDaytonaCredits(data.daytonaCredits);
          if (data.isSynced !== undefined) setIsSynced(data.isSynced);
        } else {
          // Initialize core system state
          setDoc(systemRef, { daytonaCredits: 19842, isSynced: false }).catch(e => console.log(e));
        }
      });

      return () => {
        unsubscribeAgents();
        unsubscribeSystem();
      };
    } catch (e) {
      console.error("Firebase not initialized: ", e);
      setFirebaseError(true);
    }
  }, []);

  // Update canvas nodes based on active widget
  useEffect(() => {
    if (activeWidget === 'android-studio') setConstellation('android-party');
    else if (activeWidget === 'carapace-firewall') setConstellation('carapace-sec');
    else if (activeWidget === 'mecha-run') setConstellation('mecha-party');
    else if (activeWidget === 'factory') setConstellation('cinematic');
    else if (activeWidget === 'x-growth') setConstellation('x-growth');
    else if (activeWidget === 'bridge') setConstellation('research');
  }, [activeWidget]);

  return (
    <div className="app-shell">
      <MouseConstellation />

      {firebaseError && (
        <div className="system-warning">
          Firebase config missing. Add real keys to src/firebase.js — running in degraded simulation mode.
        </div>
      )}

      <TopBar daytonaCredits={daytonaCredits} activeNodes={activeAgents.length} />

      <Sidebar
        activeWidget={activeWidget}
        setActiveWidget={setActiveWidget}
        setConstellation={setConstellation}
      />

      <main className="workspace">
        <Canvas3D constellationMode={constellation} activeAgents={activeAgents} />

        {activeWidget === 'android-studio' && (
          <AndroidStudio setActiveAgents={setActiveAgents} activeAgents={activeAgents} firebaseError={firebaseError} />
        )}
        {activeWidget === 'x-growth' && (
          <XGrowth setActiveAgents={setActiveAgents} firebaseError={firebaseError} />
        )}
        {activeWidget === 'carapace-firewall' && (
          <CarapaceFirewall />
        )}
        {activeWidget === 'mecha-run' && (
          <MechaRun firebaseError={firebaseError} setActiveAgents={setActiveAgents} />
        )}
        {activeWidget === 'factory' && (
          <AgentFactory setActiveAgents={setActiveAgents} activeAgents={activeAgents} firebaseError={firebaseError} />
        )}
        {activeWidget === 'bridge' && (
          <NOESISBridge
            isSynced={isSynced}
            setIsSynced={setIsSynced}
            daytonaCredits={daytonaCredits}
            setDaytonaCredits={setDaytonaCredits}
            firebaseError={firebaseError}
          />
        )}
      </main>
    </div>
  );
}

export default App;
