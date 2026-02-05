// src/lib/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// --- REPLACE THE STUFF BELOW WITH YOUR COPIED KEYS ---
const firebaseConfig = {
    apiKey: "AIzaSyALIsIuDyGj-hTODMsueu0uTngblkubwQE",
    authDomain: "eda-insight.firebaseapp.com",
    projectId: "eda-insight",
    storageBucket: "eda-insight.firebasestorage.app",
    messagingSenderId: "289811599432",
    appId: "1:289811599432:web:7cc7da3d793d06ff4e087d",
    measurementId: "G-2SG11B8GN9"
  };
  
// -----------------------------------------------------

// This logic checks: "Is the app already connected to Firebase?" 
// If no, connect it. If yes, just use the current connection.
// This prevents errors when you save your code and the app refreshes.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exporting these makes them available to your whole app
export const auth = getAuth(app);      // Used for Login/Signup
export const db = getFirestore(app);    // Used for History/Chatbot
export const rtdb = getDatabase(app);  // Used for Live 3D Data Streaming