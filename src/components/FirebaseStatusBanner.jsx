import React, { useState } from 'react';
import { Database, AlertTriangle, RefreshCw, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase/config';
import { writeSensorData } from '../services/firebaseService';

export default function FirebaseStatusBanner({
  isDemoMode,
  setIsDemoMode,
  isLoading,
  firebaseError,
  isRecording,
  recordFeedback,
  onRecordTestReading
}) {
  const [isSending, setIsSending] = useState(false);
  const [writeStatus, setWriteStatus] = useState(null);

  const handleSendTestData = async () => {
    setIsSending(true);
    setWriteStatus(null);
    const now = new Date();
    const timestamp = now.getTime();
    
    // Explicit Test Payload as specified in requirements
    const testPayload = {
      temperature: 29.5,
      humidity: 65,
      soilMoisture: 45,
      fanActive: false,
      pumpActive: false,
      timestamp: timestamp
    };

    try {
      await writeSensorData('plant_01', testPayload);
      setWriteStatus({
        type: 'success',
        message: 'Test data successfully written to Firebase Realtime Database (/polyhouse/plant_01/live)!',
        payload: testPayload,
        time: now.toLocaleTimeString()
      });
    } catch (err) {
      console.error("Firebase test write error:", err);
      setWriteStatus({
        type: 'error',
        message: `Firebase write failed: ${err.message || 'Permission denied or database connection issue.'}`,
        time: now.toLocaleTimeString()
      });
    } finally {
      setIsSending(false);
    }
  };

  // If Firebase is configured and running with no errors
  if (isFirebaseConfigured && !isDemoMode && !isLoading && !firebaseError) {
    return (
      <div style={{
        background: 'rgba(46, 204, 113, 0.08)',
        border: '1px solid rgba(46, 204, 113, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green-bright)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 600 }}>
              Firebase Realtime Database Connected • Streaming Live ESP32 Telemetry
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              (/polyhouse/plant_01/live)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              id="send-test-data-btn"
              className="btn-primary"
              onClick={handleSendTestData}
              disabled={isSending || isRecording}
              style={{
                fontSize: '0.8rem',
                padding: '7px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                boxShadow: '0 0 12px rgba(46, 204, 113, 0.2)'
              }}
            >
              {isSending ? (
                <>
                  <RefreshCw size={14} className="spin" /> Writing to Firebase...
                </>
              ) : (
                <>
                  <Send size={14} /> Send Test Data
                </>
              )}
            </button>

            <button
              id="record-test-reading-btn"
              className="btn-secondary"
              onClick={onRecordTestReading}
              disabled={isSending || isRecording}
              style={{
                fontSize: '0.8rem',
                padding: '7px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                background: 'rgba(52, 152, 219, 0.15)',
                border: '1px solid rgba(52, 152, 219, 0.4)',
                color: '#3498db',
                cursor: 'pointer'
              }}
            >
              {isRecording ? (
                <>
                  <RefreshCw size={14} className="spin" /> Recording...
                </>
              ) : (
                <>
                  <Database size={14} /> Record Test Reading
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert Box */}
        {writeStatus && (
          <div style={{
            background: writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.15)',
            border: `1px solid ${writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: writeStatus.type === 'success' ? '#2ecc71' : '#e74c3c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {writeStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <strong>{writeStatus.message}</strong>
                {writeStatus.payload && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    Payload: {JSON.stringify(writeStatus.payload)}
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, marginLeft: '12px' }}>{writeStatus.time}</span>
          </div>
        )}

        {/* Record Test Reading Feedback Alert Box */}
        {recordFeedback && (
          <div style={{
            background: recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.12)' : 'rgba(231, 76, 60, 0.15)',
            border: `1px solid ${recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: recordFeedback.type === 'success' ? '#3498db' : '#e74c3c',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {recordFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <strong>{recordFeedback.message}</strong>
                {recordFeedback.payload && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    Payload: {JSON.stringify(recordFeedback.payload)}
                  </div>
                )}
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, marginLeft: '12px' }}>{recordFeedback.time}</span>
          </div>
        )}
      </div>
    );
  }

  // Loading State
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
            Listening for real-time telemetry from /polyhouse/plant_01/live node.
          </div>
        </div>
      </div>
    );
  }

  // Error State or Not Configured State
  if (!isFirebaseConfigured || firebaseError) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 145, 0, 0.12), rgba(24, 40, 30, 0.9))',
        border: '1px solid rgba(255, 145, 0, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <AlertTriangle size={24} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#fff' }}>
                {!isFirebaseConfigured ? 'Firebase Configuration Not Detected' : 'Firebase Database Connection Notice'}
              </strong>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  id="send-test-data-btn-err"
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={handleSendTestData}
                  disabled={isSending || isRecording}
                >
                  <Send size={14} /> Send Test Data
                </button>
                <button
                  id="record-test-reading-btn-err"
                  className="btn-secondary"
                  style={{ 
                    fontSize: '0.78rem', 
                    padding: '6px 12px',
                    background: 'rgba(52, 152, 219, 0.15)',
                    border: '1px solid rgba(52, 152, 219, 0.4)',
                    color: '#3498db',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={onRecordTestReading}
                  disabled={isSending || isRecording}
                >
                  <Database size={14} /> Record Test Reading
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={() => setIsDemoMode(true)}
                  disabled={isSending || isRecording}
                >
                  <RefreshCw size={14} /> Enable Interactive Demo Simulator
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
              {!isFirebaseConfigured ? (
                <>
                  Firebase environment variables (<code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_DATABASE_URL</code>) are missing in your <code>.env</code> file. Create a <code>.env</code> file in the project root to connect to your live Firebase project.
                </>
              ) : (
                <>
                  Database warning: {firebaseError?.message || 'Unable to read node /polyhouse/plant_01/live. Check database security rules in Firebase Console.'}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alert Box on Error Banner */}
        {writeStatus && (
          <div style={{
            background: writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.15)',
            border: `1px solid ${writeStatus.type === 'success' ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: writeStatus.type === 'success' ? '#2ecc71' : '#e74c3c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {writeStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <strong>{writeStatus.message}</strong>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{writeStatus.time}</span>
          </div>
        )}

        {/* Record Test Reading Feedback Alert Box on Error Banner */}
        {recordFeedback && (
          <div style={{
            background: recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.12)' : 'rgba(231, 76, 60, 0.15)',
            border: `1px solid ${recordFeedback.type === 'success' ? 'rgba(52, 152, 219, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: recordFeedback.type === 'success' ? '#3498db' : '#e74c3c',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {recordFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <div>
                <strong>{recordFeedback.message}</strong>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{recordFeedback.time}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
