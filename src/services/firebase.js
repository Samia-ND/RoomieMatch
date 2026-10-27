// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔑 Remplace ces valeurs par celles de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCgCTBzYxA8QfOVo4FvhSXZKA-FXHxU-Q",
  authDomain: "roomiematch-65af4.firebaseapp.com",
  projectId: "roomiematch-65af4",
  storageBucket: "roomiematch-65af4.firebasestorage.app",
  messagingSenderId: "692840385306",
  appId: "1:692840385306:web:a195b6e4682cf2e01c3aa3"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services Firebase
export const db = getFirestore(app); // Base de données
export const auth = getAuth(app);     // Authentification
export default app;
