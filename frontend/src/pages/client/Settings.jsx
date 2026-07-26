import { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Profile updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <>
      <div className="dash-header">
        <h1>Account Settings</h1>
        <p>Manage your account profile and contact details.</p>
      </div>

      {savedMessage && (
        <div className="settings-alert-banner">
          <span>✓ {savedMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: 680 }}>
        <form className="card-widget settings-card" onSubmit={handleSave}>
          <div className="settings-profile-header">
            <div className="settings-profile-avatar">
              {user?.initials || 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>{user?.name || 'Client Account'}</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email || 'client@queensbanquet.ph'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input defaultValue={user?.name || ''} className="settings-input" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" defaultValue={user?.email || ''} className="settings-input" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input defaultValue="" placeholder="+63 917 000 0000" className="settings-input" />
          </div>
          <Button variant="gold" type="submit" style={{ marginTop: 12 }}>Save Profile</Button>
        </form>
      </div>
    </>
  );
}
