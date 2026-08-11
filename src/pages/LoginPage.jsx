import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, Activity, RefreshCw } from 'lucide-react';
import { loginUser } from '../services/authService';
import { isFirebaseConfigured } from '../firebase/config';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      onLoginSuccess(user);
    } catch (err) {
      console.error("Login failure:", err);
      let friendlyMessage = "Failed to sign in. Please verify connection and database permissions.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = "Invalid email or password. Verify your entries.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = "Access blocked temporarily due to multiple failed login attempts. Try again later.";
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
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
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '28px',
          textAlign: 'center'
        }}>
          <div className="brand-icon" style={{
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
            color: '#fff',
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

        {/* Login Card */}
        <div className="card" style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(46, 204, 113, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Secure Ingress</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Verify credential keys to monitor and control polyhouse climate
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
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@polyhouse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
                  required
                  autoComplete="email"
                />
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '38px', paddingRight: '38px', borderRadius: 'var(--radius-sm)' }}
                  required
                  autoComplete="current-password"
                />
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="login-submit-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                marginTop: '8px',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Verifying...
                </>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>
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
