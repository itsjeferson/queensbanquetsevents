import { useState } from 'react';
import { invitationService } from '../../services/invitationService';
import { getCoupleDisplayName } from '../../utils/invitationContent';
import Loader from '../common/Loader/Loader';

export default function PasswordGate({ event, invitation, onUnlocked }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const coupleName = getCoupleDisplayName(event, invitation);

  const triggerUnlockBuffer = () => {
    setUnlocking(true);
    setTimeout(() => {
      onUnlocked?.();
    }, 750);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entered = password.trim();
    if (!entered || verifying || unlocking) return;
    setVerifying(true);
    setError('');

    // 1. Client-side fast match if invitation contains password (e.g. preview / loaded state)
    if (invitation?.password && invitation.password === entered) {
      setVerifying(false);
      triggerUnlockBuffer();
      return;
    }

    try {
      const res = await invitationService.verifyPassword({
        slug: event?.slug,
        password: entered,
      });
      if (res?.success) {
        triggerUnlockBuffer();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      // 2. Fallback check if invitation.password exists or if backend route throws 405/404
      if (invitation?.password && invitation.password === entered) {
        triggerUnlockBuffer();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section className={`inv-password-gate${unlocking ? ' inv-password-gate--unlocking' : ''}`} id="password-gate">
      <div className="inv-password-gate-backdrop" />
      <div className="inv-password-gate-content">
        <div className="inv-password-gate-header">
          <h2 className="inv-password-gate-couple">{coupleName}</h2>
          <p className="inv-password-gate-subtitle">
            {unlocking ? 'Opening invitation...' : 'This invitation is password protected'}
          </p>
        </div>

        {unlocking ? (
          <div className="inv-password-gate-buffer">
            <div className="inv-password-gate-success-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="inv-password-gate-buffer-text">Access Granted</span>
            <Loader size="md" tone="dark" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="inv-password-gate-form">
            <div className="inv-password-gate-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                disabled={verifying || unlocking}
              />
            </div>
            {error && <p className="inv-password-gate-error">{error}</p>}
            <button
              type="submit"
              className="btn btn-gold"
              disabled={!password.trim() || verifying || unlocking}
            >
              {verifying ? <Loader size="sm" tone="light" /> : 'Enter Invitation'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
