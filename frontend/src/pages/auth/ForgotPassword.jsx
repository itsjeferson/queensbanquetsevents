import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

export default function ForgotPassword() {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div style={{ position: 'relative' }}>
          <div className="section-tag" style={{ color: 'var(--gold)' }}>Account Recovery</div>
          <h2>Reset Your <br />Password</h2>
          <p>Enter your email and we will send you a link to reset your password.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form-inner">
          <h3>Forgot Password</h3>
          <p className="subtitle">Remember your password? <Link to="/login">Back to sign in</Link></p>
          <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" /></div>
          <Button variant="gold" style={{ width: '100%', padding: 14 }}>Send Reset Link</Button>
        </div>
      </div>
    </div>
  );
}
