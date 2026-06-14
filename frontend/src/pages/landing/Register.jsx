import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await register(form);
    navigate('/client');
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div style={{ position: 'relative' }}>
          <div className="section-tag" style={{ color: 'var(--gold)' }}>Join Velura</div>
          <h2>Start Planning<br />Your Perfect<br />Event Today</h2>
          <p>Create an account to access exclusive packages, track your bookings, and connect with our team.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <h3>Create Account</h3>
          <p className="subtitle">Already have one? <Link to="/login">Sign in</Link></p>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Maria" /></div>
            <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Santos" /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" /></div>
          <div className="form-group"><label>Phone Number</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="+63 917 000 0000" /></div>
          <div className="form-group"><label>Password</label><input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" /></div>
          <div className="form-group"><label>Confirm Password</label><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" /></div>
          <Button variant="gold" style={{ width: '100%', padding: 14, marginTop: 8 }} onClick={handleSubmit}>Create Account</Button>
          <div className="auth-switch" style={{ fontSize: 12, marginTop: 16 }}>
            By registering, you agree to our <span style={{ color: 'var(--gold-dark)' }}>Terms of Service</span> and <span style={{ color: 'var(--gold-dark)' }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
