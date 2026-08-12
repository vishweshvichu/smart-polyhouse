import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, Activity, RefreshCw, User, CheckCircle2 } from 'lucide-react';
import { registerUser } from '../services/authService';
import { isFirebaseConfigured } from '../firebase/config';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 * Never exposes raw Firebase error codes or technical details.
 */
const getSignUpError = (err) => {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password (at least 6 characters).';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-up is not enabled. Please contact the administrator.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Failed to create account. Please try again.';
  }
};

export default function SignUpPage({ onSignUpSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(name.trim(), email.trim(), password);
      // Show brief success state, then redirect
      setSuccess(true);
      setTimeout(() => {
        onSignUpSuccess(user);
      }, 1200);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(getSignUpError(err));
    } finally {
      setLoading(false);
    }
  };

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

  const inputStyle = {
    paddingLeft: '38px',
    borderRadius: 'var(--radius-sm)'
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
          marginBottom: '24px',
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

        {/* Sign Up Card */}
        <div className="card" style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Create Account
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Register to access the Smart Polyhouse dashboard
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div style={{
              background: 'rgba(46, 204, 113, 0.1)',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={22} style={{ color: 'var(--accent-green-bright)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent-green-bright)', fontSize: '0.9rem' }}>
                  Account created successfully!
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Welcome, {name.trim()}. Redirecting to dashboard...
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !success && (
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
              <div>{error}</div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    style={inputStyle}
                    required
                    autoComplete="name"
                    id="signup-name"
                  />
                  <User size={16} style={iconStyle} />
                </div>
              </div>

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
                    style={inputStyle}
                    required
                    autoComplete="email"
                    id="signup-email"
                  />
                  <Mail size={16} style={iconStyle} />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 400 }}>(min. 6 characters)</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{ ...inputStyle, paddingRight: '40px' }}
                    required
                    autoComplete="new-password"
                    id="signup-password"
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

              {/* Confirm Password */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    style={{ ...inputStyle, paddingRight: '40px' }}
                    required
                    autoComplete="new-password"
                    id="signup-confirm-password"
                  />
                  <Lock size={16} style={iconStyle} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%',
                      transform: 'translateY(-50%)', background: 'transparent',
                      border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', padding: '4px'
                    }}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword && password && (
                  <div style={{
                    marginTop: '5px',
                    fontSize: '0.73rem',
                    color: confirmPassword === password ? 'var(--accent-green-bright)' : 'var(--accent-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                id="signup-submit-btn"
                style={{
                  width: '100%', justifyContent: 'center',
                  padding: '12px', marginTop: '4px',
                  fontSize: '0.92rem', borderRadius: 'var(--radius-md)'
                }}
              >
                {loading ? (
                  <><RefreshCw size={18} className="spin" /> Creating Account...</>
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </form>
          )}

          {/* Link back to login */}
          <div style={{
            textAlign: 'center', marginTop: '20px',
            fontSize: '0.84rem', color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              id="goto-login-btn"
              style={{
                background: 'none', border: 'none',
                color: 'var(--accent-green-bright)', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.84rem', padding: 0,
                textDecoration: 'underline', textUnderlineOffset: '2px'
              }}
            >
              Sign In
            </button>
          </div>
        </div>

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
