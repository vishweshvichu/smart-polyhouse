import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, set, update } from 'firebase/database';
import { auth, database } from '../firebase/config';

/**
 * Sign in a user with email and password.
 * Updates lastLogin timestamp in the user profile on success.
 * Password is handled entirely by Firebase Auth — never stored elsewhere.
 */
export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update lastLogin timestamp in database (non-sensitive, safe to store)
  if (database && user?.uid) {
    try {
      const profileRef = ref(database, `users/${user.uid}`);
      await update(profileRef, { lastLogin: Date.now() });
    } catch {
      // Non-critical: don't block login if profile update fails
    }
  }

  return user;
};

/**
 * Register a new user with email and password.
 * Password is handled entirely by Firebase Auth — never stored elsewhere.
 * Saves non-sensitive profile info to /users/{uid} in Realtime Database.
 */
export const registerUser = async (name, email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }

  // 1. Create the Firebase Auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Set the display name on the Firebase Auth profile (not a password, safe)
  try {
    await updateProfile(user, { displayName: name.trim() });
  } catch {
    // Non-critical: profile display name update failure won't block account creation
  }

  // 3. Save safe profile info to /users/{uid} — NO password stored
  await saveUserProfile(user.uid, { name: name.trim(), email });

  return user;
};

/**
 * Save a safe user profile to /users/{uid} in Firebase Realtime Database.
 * Stores ONLY: name, email, role, createdAt, lastLogin.
 * NEVER stores passwords, tokens, or private credentials.
 */
export const saveUserProfile = async (uid, { name, email }) => {
  if (!database) return;
  const profileRef = ref(database, `users/${uid}`);
  await set(profileRef, {
    name: name || '',
    email: email || '',
    role: 'user',
    createdAt: Date.now(),
    lastLogin: Date.now()
  });
};

/**
 * Sign out the current user
 */
export const logoutUser = async () => {
  if (!auth) return;
  await signOut(auth);
};

/**
 * Send a password reset email using Firebase Authentication.
 * Does NOT store or transmit the password — Firebase handles everything.
 */
export const sendPasswordReset = async (email) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }
  await sendPasswordResetEmail(auth, email);
};

/**
 * Subscribe to authentication state changes.
 * Firebase automatically restores the session on page refresh.
 * Returns an unsubscribe function.
 */
export const subscribeToAuthChanges = (callback) => {
  if (!auth) {
    // If auth is not initialized, immediately callback with null
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
