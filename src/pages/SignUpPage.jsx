import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, Activity, RefreshCw, User } from 'lucide-react';
import { registerUser } from '../services/authService';
import { isFirebaseConfigured } from '../firebase/config';

export default function SignUpPage({ onSignUpSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFriendlyError = (err) => {
    if (err.code === 'auth/email-already-in-use') {
      return 'This email is already registered. Please log in instead.';
    } else if (err.code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    } else if (err.code === 'auth/weak-password') {
      return 'Password is too weak. Please choose a stronger password (at least 6 characters).';
    } else if (err.code === 'auth/network-request-failed') {
      return 'Network error. Please check your connection and try again.';
    } else if (err.code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-up is not enabled. Please contact the administrator.';
    } else if (err.message) {
      return err.message;
    }
    return 'Failed to create account. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email) {
      setError('Please enter your email address.');
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
      const user = await registerUser(name.trim(), email, password);
      onSignUpSuccess(user);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    paddingLeft: '38px',
    borderRadius: 'var(--radius-sm)'
  };
  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(46, 204, 113, 0.05) 0%, transparent 60%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
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
            boxShadow: '0 8px 24px rgba(46, 204, 113, 0.25)',
            marginBottom: '14px'
          }}>
            <Activity size={28} />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            background: 'linear-gradient(120deg, #ffffff, var(--accent-green-bright))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            SMART POLYHOUSE
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Precision Agronomic Telemetry Dashboard
          </div>
        </div>

        {/* Sign Up Card */}
        <div className="card" style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(46, 204, 113, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px'
        }}>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Create Account</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Register to access the Smart Polyhouse dashboard
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
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  required
                  autoComplete="name"
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
                />
                <Mail size={16} style={iconStyle} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, paddingRight: '38px' }}
                  required
                  autoComplete="new-password"
                />
                <Lock size={16} style={iconStyle} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'transparent',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: 0
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
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, paddingRight: '38px' }}
                  required
                  autoComplete="new-password"
                />
                <Lock size={16} style={iconStyle} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'transparent',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: 0
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="signup-submit-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                marginTop: '4px',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {loading ? (
                <><RefreshCw size={18} className="spin" /> Creating Account...</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div style={{
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-green-bright)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4'
        }}>
          Protected by Firebase Authentication.
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
