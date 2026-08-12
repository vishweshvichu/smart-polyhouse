import React from 'react';
import { AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

/**
 * FirebaseStatusBanner
 *
 * Shows a compact green badge when connected and streaming,
 * a blue spinner while connecting, or an amber warning if
 * Firebase reports a database error.
 *
 * The "Firebase not configured" state no longer exists — Firebase
 * always initialises from the project config (env vars or hardcoded
 * defaults for project smart-polyhouse-71e66).
 */
export default function FirebaseStatusBanner({ isDemoMode, isLoading, firebaseError }) {

  // Firebase error state (e.g. security-rules denial, network failure)
  if (firebaseError) {
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
          <strong style={{ fontSize: '0.92rem', color: '#fff' }}>Firebase Database Connection Issue</strong>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
            {firebaseError?.message || 'Unable to read /polyhouse/plant_01/live. Check Firebase Realtime Database security rules.'}
          </div>
        </div>
      </div>
    );
  }

  // Connecting / loading state
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
            Listening for live ESP32 telemetry on /polyhouse/plant_01/live
          </div>
        </div>
      </div>
    );
  }

  // Firebase connected and streaming live data — compact green indicator
  if (!isDemoMode && !isLoading) {
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
        <span style={{ fontWeight: 600, color: 'var(--accent-green-bright)' }}>Firebase Connected</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
          Streaming live ESP32 telemetry · /polyhouse/plant_01/live
        </span>
      </div>
    );
  }

  return null;
}
