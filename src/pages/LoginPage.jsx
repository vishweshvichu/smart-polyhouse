import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, Activity, RefreshCw, CheckCircle2, KeyRound } from 'lucide-react';
import { loginUser, sendPasswordReset } from '../services/authService';
import { isFirebaseConfigured } from '../firebase/config';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 * Never exposes raw Firebase error codes or technical details.
 */
const getLoginError = (err) => {
  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please check your credentials.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'Failed to sign in. Please try again.';
  }
};

export default function LoginPage({ onLoginSuccess, onGoToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      console.error('Login failure:', err);
      setError(getLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setResetError('No account found with that email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setResetError('Too many reset requests. Please wait and try again.');
      } else {
        setResetError('Failed to send reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Common card style
  const cardStyle = {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(46, 204, 113, 0.2)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 24px'
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(46, 204, 113, 0.06) 0%, transparent 60%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '28px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1b5e20, var(--accent-green))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(46, 204, 113, 0.3)',
            marginBottom: '14px',
            flexShrink: 0
          }}>
            <Activity size={28} />
          </div>
          <h1 style={{
            fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
            fontWeight: 800,
            letterSpacing: '0.5px',
            background: 'linear-gradient(120deg, #ffffff, var(--accent-green-bright))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
            lineHeight: 1.2
          }}>
            SMART POLYHOUSE
          </h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Precision Agronomic Telemetry Dashboard
          </div>
        </div>

        {/* ---- FORGOT PASSWORD VIEW ---- */}
        {showForgotPassword ? (
          <div className="card" style={cardStyle}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Reset Password
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Enter your account email. We'll send a password reset link.
              </p>
            </div>

            {resetSuccess ? (
              <div style={{
                background: 'rgba(46, 204, 113, 0.1)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-green-bright)', flexShrink: 0, marginTop: '1px' }} />
                <div style={{ fontSize: '0.84rem', color: 'var(--accent-green-bright)' }}>
                  <strong>Reset email sent!</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontSize: '0.78rem' }}>
                    Check your inbox at <strong>{resetEmail}</strong> for instructions to reset your password.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {resetError && (
                  <div style={{
                    background: 'rgba(255, 82, 82, 0.1)',
                    border: '1px solid rgba(255, 82, 82, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    color: 'var(--accent-danger)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>{resetError}</div>
                  </div>
                )}

                <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={resetLoading}
                        style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
                        autoComplete="email"
                        required
                      />
                      <Mail size={16} style={iconStyle} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={resetLoading}
                    style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem', borderRadius: 'var(--radius-md)' }}
                  >
                    {resetLoading ? (
                      <><RefreshCw size={17} className="spin" /> Sending...</>
                    ) : (
                      <><KeyRound size={17} /> Send Reset Email</>
                    )}
                  </button>
                </form>
              </>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <button
                onClick={() => { setShowForgotPassword(false); setResetEmail(''); setResetError(null); setResetSuccess(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-green-bright)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' }}
              >
                ← Back to Sign In
              </button>
            </div>
          </div>

        ) : (

          /* ---- LOGIN VIEW ---- */
          <div className="card" style={cardStyle}>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Sign In
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Access your Smart Polyhouse monitoring dashboard
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(255, 82, 82, 0.1)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                color: 'var(--accent-danger)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '18px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
                    required
                    autoComplete="email"
                    id="login-email"
                  />
                  <Mail size={16} style={iconStyle} />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setResetEmail(email); }}
                    style={{
                      background: 'none', border: 'none',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      fontSize: '0.75rem', padding: 0,
                      textDecoration: 'underline', textUnderlineOffset: '2px'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{ paddingLeft: '38px', paddingRight: '40px', borderRadius: 'var(--radius-sm)' }}
                    required
                    autoComplete="current-password"
                    id="login-password"
                  />
                  <Lock size={16} style={iconStyle} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%',
                      transform: 'translateY(-50%)', background: 'transparent',
                      border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', padding: '4px'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                id="login-submit-btn"
                style={{
                  width: '100%', justifyContent: 'center',
                  padding: '12px', marginTop: '6px',
                  fontSize: '0.92rem', borderRadius: 'var(--radius-md)'
                }}
              >
                {loading ? (
                  <><RefreshCw size={18} className="spin" /> Signing in...</>
                ) : (
                  <><LogIn size={18} /> Sign In</>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div style={{
              textAlign: 'center', marginTop: '22px',
              fontSize: '0.84rem', color: 'var(--text-secondary)'
            }}>
              Don&apos;t have an account?{' '}
              <button
                onClick={onGoToSignUp}
                id="goto-signup-btn"
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--accent-green-bright)', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.84rem', padding: 0,
                  textDecoration: 'underline', textUnderlineOffset: '2px'
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: '18px',
          fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.5'
        }}>
          Protected by Firebase Authentication · All passwords are securely managed by Google
          {!isFirebaseConfigured && (
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
              ⚠ Firebase not configured — check environment variables.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
