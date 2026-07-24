import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Public web config — safe to ship. Access control lives in Firestore rules
// (see firestore.rules): reads and writes require an authenticated session,
// and every swarm document is scoped to its owner's uid.
const firebaseConfig = {
  apiKey: "AIzaSyCmh0BfMmvRaGaWeD0RX3xBX5ifbjIzJMY",
  authDomain: "noesis-and-aether.firebaseapp.com",
  projectId: "noesis-and-aether",
  storageBucket: "noesis-and-aether.firebasestorage.app",
  messagingSenderId: "587479579120",
  appId: "1:587479579120:web:7e658f69b9586c663f4535"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth,
  signInAnonymously,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
  writeBatch
};
