import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, onSnapshot, query, deleteDoc, doc, setDoc, writeBatch } from 'firebase/firestore';

// AETHER Firebase Configuration
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

export { db, collection, addDoc, getDocs, getDoc, onSnapshot, query, deleteDoc, doc, setDoc, writeBatch };
