import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC2lUwIpgOwtH2pDqQ71dA38i22ttyMTds",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smart-polyhouse-71e66.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://smart-polyhouse-71e66-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smart-polyhouse-71e66",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smart-polyhouse-71e66.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "62114380066",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:62114380066:web:22cc24b436071a20608d7b"
};

// Check if Firebase environment variables are configured
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_DATABASE_URL
);

let app;
let database;
let auth;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  } else {
    // Attempt fallback init with available defaults
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Firebase initialization warning (falling back to simulator if offline):", error);
}

export { app, database, auth };
