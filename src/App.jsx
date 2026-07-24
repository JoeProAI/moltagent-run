import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MouseConstellation from './components/MouseConstellation';
import ErrorBoundary from './components/ErrorBoundary';
import AndroidStudio from './components/widgets/AndroidStudio';
import CarapaceFirewall from './components/widgets/CarapaceFirewall';
import MechaRun from './components/widgets/MechaRun';
import AgentFactory from './components/widgets/AgentFactory';
import XGrowth from './components/widgets/XGrowth';
import NOESISBridge from './components/widgets/NOESISBridge';
import {
  db,
  auth,
  signInAnonymously,
  onAuthStateChanged,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc
} from './firebase';

// Three.js is heavy and only powers the ambient background — split it out of
// the main bundle so first paint doesn't wait on it.
const Canvas3D = lazy(() => import('./components/Canvas3D'));

function App() {
  const [activeWidget, setActiveWidget] = useState('android-studio');
  const [constellation, setConstellation] = useState('android-party');
  const [activeAgents, setActiveAgents] = useState([]);
  const [daytonaCredits, setDaytonaCredits] = useState(19842);
  const [isSynced, setIsSynced] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [localMode, setLocalMode] = useState(false);

  // Sign in anonymously so every visitor gets a stable, private session id.
  // If anonymous auth isn't enabled on the project (or we're offline), fall
  // back to a browser-local sandbox instead of writing to shared state.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    let cancelled = false;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (cancelled) return;
      if (user) {
        setSessionId(user.uid);
      }
    });
    signInAnonymously(auth).catch((error) => {
      console.warn('Anonymous auth unavailable — running in local mode:', error?.code || error);
      if (!cancelled) setLocalMode(true);
    });
    return () => {
      cancelled = true;
      unsub();
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Real-time sync, scoped to this session only. No session id → no listeners
  // (local mode drives everything from component state instead).
  useEffect(() => {
    if (!sessionId) return;
    /* eslint-disable react-hooks/set-state-in-effect */

    const agentsQuery = query(collection(db, 'activeAgents'), where('owner', '==', sessionId));
    const unsubscribeAgents = onSnapshot(
      agentsQuery,
      (snapshot) => {
        setActiveAgents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        console.warn('Firestore read blocked — running in local mode:', error?.code || error);
        setLocalMode(true);
      }
    );

    const stateRef = doc(db, 'userState', sessionId);
    const unsubscribeState = onSnapshot(
      stateRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.daytonaCredits !== undefined) setDaytonaCredits(data.daytonaCredits);
          if (data.isSynced !== undefined) setIsSynced(data.isSynced);
        } else {
          setDoc(stateRef, { daytonaCredits: 19842, isSynced: false, owner: sessionId }).catch(() => {});
        }
      },
      () => setLocalMode(true)
    );

    return () => {
      unsubscribeAgents();
      unsubscribeState();
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [sessionId]);

  // Derive canvas constellation from active widget selection
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (activeWidget === 'android-studio') setConstellation('android-party');
    else if (activeWidget === 'carapace-firewall') setConstellation('carapace-sec');
    else if (activeWidget === 'mecha-run') setConstellation('mecha-party');
    else if (activeWidget === 'factory') setConstellation('cinematic');
    else if (activeWidget === 'x-growth') setConstellation('x-growth');
    else if (activeWidget === 'bridge') setConstellation('research');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [activeWidget]);

  // Widgets write to Firestore only when we have a live session; otherwise
  // they keep everything in local component state.
  const cloudSync = !localMode && Boolean(sessionId);

  return (
    <div className="app-shell">
      <MouseConstellation />

      {localMode && (
        <div className="system-warning">
          Running locally in your browser — swarm state won't sync. Live sync needs Anonymous
          Auth enabled and the Firestore rules published (see firestore.rules).
        </div>
      )}

      <TopBar daytonaCredits={daytonaCredits} activeNodes={activeAgents.length} />

      <Sidebar
        activeWidget={activeWidget}
        setActiveWidget={setActiveWidget}
        setConstellation={setConstellation}
      />

      <main className="workspace">
        <Suspense fallback={null}>
          <Canvas3D constellationMode={constellation} activeAgents={activeAgents} />
        </Suspense>

        <ErrorBoundary key={activeWidget}>
          {activeWidget === 'android-studio' && (
            <AndroidStudio setActiveAgents={setActiveAgents} activeAgents={activeAgents} cloudSync={cloudSync} sessionId={sessionId} />
          )}
          {activeWidget === 'x-growth' && (
            <XGrowth setActiveAgents={setActiveAgents} />
          )}
          {activeWidget === 'carapace-firewall' && (
            <CarapaceFirewall />
          )}
          {activeWidget === 'mecha-run' && (
            <MechaRun cloudSync={cloudSync} sessionId={sessionId} setActiveAgents={setActiveAgents} />
          )}
          {activeWidget === 'factory' && (
            <AgentFactory setActiveAgents={setActiveAgents} activeAgents={activeAgents} cloudSync={cloudSync} sessionId={sessionId} />
          )}
          {activeWidget === 'bridge' && (
            <NOESISBridge
              isSynced={isSynced}
              setIsSynced={setIsSynced}
              daytonaCredits={daytonaCredits}
              setDaytonaCredits={setDaytonaCredits}
              cloudSync={cloudSync}
              sessionId={sessionId}
            />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
