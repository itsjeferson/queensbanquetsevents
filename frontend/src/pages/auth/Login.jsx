import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { isAdminRole } from '../../utils/roles';

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a18.45 18.45 0 0 1-2.16 3.19" />
      <path d="M6.61 6.61A18.48 18.48 0 0 0 2 12s3.5 7 10 7a10.66 10.66 0 0 0 5.39-1.45" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await login(email.trim(), password);
      navigate(isAdminRole(user.role) ? '/admin/dashboard' : '/client/dashboard');
    } catch {
      setLoginError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div style={{ position: 'relative' }}>
          <div className="section-tag" style={{ color: 'var(--gold)' }}>Queen&apos;s Banquet</div>
          <h2>Sign in to <br />Your Account</h2>
          <p>Create, customize, and share digital invitations with RSVP monitoring.</p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Build and publish invitation pages',
              'Share links and QR codes with guests',
              'Monitor RSVPs in real time',
              'Manage templates and gallery assets',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <span style={{ color: 'var(--gold)' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <div className="auth-brand">
            <div className="auth-brand-name">Queen&apos;s Banquet</div>
            <div className="auth-brand-tagline">Events Management</div>
          </div>
          <h3>Sign In</h3>
          <div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontWeight: 400, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 'auto' }} /> Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--gold-dark)', fontWeight: 500 }}>Forgot password?</Link>
          </div>
          {loginError && <p style={{ color: '#DC3545', fontSize: 13, marginBottom: 16 }}>{loginError}</p>}
          <Button variant="gold" style={{ width: '100%', padding: 14 }} onClick={handleLogin}>Sign In</Button>
        </div>
      </div>
    </div>
  );
}
