import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

/**
 * Firebase configuration for Smart Polyhouse (project: smart-polyhouse-71e66).
 *
 * Priority order:
 *   1. VITE_FIREBASE_* environment variables (set in Vercel / .env)
 *   2. Hardcoded project defaults (same Firebase project, safe to commit — these are
 *      client-side identifiers, NOT secret keys; see Firebase docs on API key security)
 *
 * The Firebase Security Rules in the console control actual data access.
 * These config values are NOT admin credentials and do not grant write access.
 */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyC2lUwIpgOwtH2pDqQ71dA38i22ttyMTds",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "smart-polyhouse-71e66.firebaseapp.com",
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL       || "https://smart-polyhouse-71e66-default-rtdb.firebaseio.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "smart-polyhouse-71e66",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "smart-polyhouse-71e66.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "62114380066",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:62114380066:web:22cc24b436071a20608d7b"
};

/**
 * isFirebaseConfigured is TRUE whenever ALL required config values are present
 * (either from env vars or the hardcoded defaults above).
 *
 * Since the defaults are always set, this will be true in both development
 * (with .env) and production (Vercel with or without explicit env vars).
 *
 * Set to false ONLY if databaseURL somehow ends up empty.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL
);

let app;
let database;
let auth;

try {
  app      = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth     = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, database, auth };
