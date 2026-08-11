import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/config';

/**
 * Sign in a user with email and password
 */
export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Register a new user with email and password.
 * Password is handled entirely by Firebase Auth — never stored elsewhere.
 */
export const registerUser = async (name, email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save safe profile info to /users/{uid} — NO password stored
  await saveUserProfile(user.uid, { name, email });

  return user;
};

/**
 * Save a safe user profile to /users/{uid} in Firebase Realtime Database.
 * Only stores: name, email, createdAt — never stores passwords or tokens.
 */
export const saveUserProfile = async (uid, { name, email }) => {
  if (!database) return;
  const profileRef = ref(database, `users/${uid}`);
  await set(profileRef, {
    name: name || '',
    email: email || '',
    createdAt: Date.now()
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
 * Subscribe to authentication state changes
 */
export const subscribeToAuthChanges = (callback) => {
  if (!auth) {
    // If auth is not initialized, immediately callback with null
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
