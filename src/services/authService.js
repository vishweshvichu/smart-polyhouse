import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

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
