import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    await login(email || 'user@email.com', password, role);
    navigate(role === 'admin' ? '/admin' : '/client');
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div style={{ position: 'relative' }}>
          <div className="section-tag" style={{ color: 'var(--gold)' }}>Welcome Back</div>
          <h2>Sign in to <br />Your Account</h2>
          <p>Access your bookings, track your events, and communicate with your event team.</p>
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['View & manage your bookings', 'Upload payment receipts', 'Track event progress', 'Message your event team'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                <span style={{ color: 'var(--gold)' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <h3>Sign In</h3>
          <p className="subtitle">Don&apos;t have an account? <Link to="/register">Create one</Link></p>
          <div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
          <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontWeight: 400, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: 'auto' }} /> Remember me
            </label>
            <span style={{ fontSize: 13, color: 'var(--gold-dark)', fontWeight: 500, cursor: 'pointer' }}>Forgot password?</span>
          </div>
          <Button variant="gold" style={{ width: '100%', padding: 14 }} onClick={() => handleLogin('client')}>Sign In as Client</Button>
          <div className="form-divider">or</div>
          <Button variant="dark" style={{ width: '100%', padding: 14 }} onClick={() => handleLogin('admin')}>Sign In as Admin</Button>
          <div className="auth-switch">New to Velura? <Link to="/register">Create an account</Link></div>
        </div>
      </div>
    </div>
  );
}
