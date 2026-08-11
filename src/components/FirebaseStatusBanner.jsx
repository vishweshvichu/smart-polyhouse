import React from 'react';
import { Database, AlertTriangle, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase/config';

export default function FirebaseStatusBanner({
  isDemoMode,
  isLoading,
  firebaseError,
}) {
  // Firebase connected and streaming — show compact status indicator only
  if (isFirebaseConfigured && !isDemoMode && !isLoading && !firebaseError) {
    return (
      <div style={{
        background: 'rgba(46, 204, 113, 0.08)',
        border: '1px solid rgba(46, 204, 113, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.84rem',
        flexWrap: 'wrap'
      }}>
        <CheckCircle2 size={16} style={{ color: 'var(--accent-green-bright)', flexShrink: 0 }} />
        <span style={{ fontWeight: 600, color: 'var(--accent-green-bright)' }}>
          Firebase Connected
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
          Streaming live ESP32 telemetry · /polyhouse/plant_01/live
        </span>
      </div>
    );
  }

  // Loading state
  if (!isDemoMode && isLoading) {
    return (
      <div style={{
        background: 'rgba(0, 176, 255, 0.1)',
        border: '1px solid rgba(0, 176, 255, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--accent-blue)'
      }}>
        <RefreshCw size={20} className="spin" />
        <div>
          <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Connecting to Firebase Realtime Database...</strong>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Listening for real-time telemetry from /polyhouse/plant_01/live
          </div>
        </div>
      </div>
    );
  }

  // Error / not configured state
  if (!isFirebaseConfigured || firebaseError) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.12), rgba(24, 40, 30, 0.9))',
        border: '1px solid rgba(255, 145, 0, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <AlertTriangle size={22} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
            {!isFirebaseConfigured ? 'Firebase Configuration Not Detected' : 'Firebase Database Connection Issue'}
          </strong>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
            {!isFirebaseConfigured ? (
              <>Firebase environment variables (<code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_DATABASE_URL</code>) are missing.</>
            ) : (
              <>Database warning: {firebaseError?.message || 'Unable to read /polyhouse/plant_01/live. Check Firebase security rules.'}</>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
