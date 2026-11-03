import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ showToast }) => {
  const { login, register, signInWithGoogle } = useAuth();
  
  // Selected Role Portal: 'STUDENT' | 'ADMIN' | 'STAFF'
  const [selectedPortal, setSelectedPortal] = useState('STUDENT');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to ensure role display always uses 'Student', 'Admin', 'Staff' (strictly singular, never 'Students')
  const getRoleLabel = (role) => {
    if (!role) return 'Student';
    const upper = String(role).toUpperCase();
    if (upper === 'STUDENT' || upper === 'STUDENTS') return 'Student';
    if (upper === 'ADMIN' || upper === 'ADMINS') return 'Admin';
    if (upper === 'STAFF') return 'Staff';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  // Demo credentials available on demand
  const demoCredentials = {
    STUDENT: { email: 'student@campusfix.edu', password: 'Student@123' },
    ADMIN: { email: 'admin@campusfix.edu', password: 'Admin@123' },
    STAFF: { email: 'staff@campusfix.edu', password: 'Staff@123' },
  };

  // Form states - clean empty fields by default to avoid accidental prefill
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'STUDENT',
    department: '',
    phone: '',
  });

  const handlePortalSwitch = (portal) => {
    setSelectedPortal(portal);
    setErrorMsg('');
    setRegisterData((prev) => ({
      ...prev,
      role: portal,
      department:
        portal === 'ADMIN'
          ? 'Campus Facilities & Operations'
          : portal === 'STAFF'
          ? 'Electrical & Facilities'
          : 'Computer Science & Engineering',
    }));
  };

  const handleFillDemoCredentials = () => {
    const creds = demoCredentials[selectedPortal];
    setLoginData({
      email: creds.email,
      password: creds.password,
    });
    if (showToast) {
      showToast(`Filled demo credentials for ${selectedPortal}`, 'info');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithGoogle(selectedPortal);
      if (showToast) {
        showToast(`Signed in to ${selectedPortal} Portal with Google!`, 'success');
      }
    } catch (err) {
      console.error(err);
      if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('api-key-not-valid')) {
        setErrorMsg('Firebase has not been provisioned with a valid Google Auth API key yet. Please approve the Firebase Setup prompt or sign in with your campus credentials.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-in window was closed. Please try again.');
      } else {
        setErrorMsg(err.message || 'Google Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginData.email || !loginData.password) {
      setErrorMsg('Please enter both email/username and password.');
      return;
    }

    setLoading(true);
    try {
      await login(loginData.email.trim(), loginData.password);
      if (showToast) {
        showToast(`Welcome back to ${selectedPortal} Dashboard!`, 'success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (registerData.password !== registerData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (registerData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        ...registerData,
        role: registerData.role || selectedPortal,
      });
      if (showToast) {
        showToast('Account registered successfully! Welcome to CampusFix.', 'success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const portalConfig = {
    STUDENT: {
      title: 'Student & Faculty Portal',
      desc: 'Report campus issues, track live SLA countdowns, and verify repair resolutions.',
      icon: GraduationCap,
      color: '#4f46e5',
      badge: 'Student / Faculty Access',
    },
    ADMIN: {
      title: 'Administrator Command Center',
      desc: 'Assign maintenance technicians, monitor campus SLAs, inspect QR locations & view analytics.',
      icon: ShieldCheck,
      color: '#4338ca',
      badge: 'Admin Management Access',
    },
    STAFF: {
      title: 'Maintenance Staff Portal',
      desc: 'View assigned work orders, update repair milestones, upload resolution proofs & resolve tickets.',
      icon: UserCheck,
      color: '#7c3aed',
      badge: 'Technician & Staff Access',
    },
  };

  const currentConfig = portalConfig[selectedPortal];
  const PortalIcon = currentConfig.icon;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
      }}
    >
      {/* Main Content Card */}
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #4338ca)',
              color: 'white',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Wrench size={26} />
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            CampusFix
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Smart Campus Maintenance & Operations System
          </p>
        </div>

        {/* Portal Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            marginBottom: '16px',
            background: '#e2e8f0',
            padding: '4px',
            borderRadius: '12px',
          }}
        >
          {['STUDENT', 'ADMIN', 'STAFF'].map((p) => {
            const isSelected = selectedPortal === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePortalSwitch(p)}
                style={{
                  border: 'none',
                  padding: '9px 8px',
                  borderRadius: '9px',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#4f46e5' : '#475569',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {getRoleLabel(p)}
              </button>
            );
          })}
        </div>

        {/* Auth Form Card */}
        <div
          className="glass-panel"
          style={{
            background: '#ffffff',
            padding: '28px 24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
          }}
        >
          {/* Card Header with Role indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${currentConfig.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentConfig.color,
                }}
              >
                <PortalIcon size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                  {currentConfig.badge}
                </p>
              </div>
            </div>
          </div>
          
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b91c1c',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '0.82rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoginMode ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>Email or Username</label>
                  {selectedPortal !== 'STUDENT' && (
                    <button
                      type="button"
                      onClick={handleFillDemoCredentials}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4f46e5',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Fill Demo Credentials
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder={selectedPortal === 'ADMIN' ? 'admin@campusfix.edu' : selectedPortal === 'STAFF' ? 'staff@campusfix.edu' : 'student@campusfix.edu'}
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{loading ? 'Signing in...' : `Sign In to ${getRoleLabel(selectedPortal)} Portal`}</span>
                <ArrowRight size={16} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                <span style={{ margin: '0 10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#1e293b',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Campus Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@campusfix.edu"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={registerData.confirm_password}
                  onChange={(e) => setRegisterData({ ...registerData, confirm_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{loading ? 'Creating Account...' : `Register for ${getRoleLabel(selectedPortal)} Portal`}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.82rem', color: '#64748b' }}>
            {isLoginMode ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(false);
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
