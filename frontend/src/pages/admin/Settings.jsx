import { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { NOTIFICATIONS_ENABLED } from '../../config/features';

export default function Settings() {
  const [savedMessage, setSavedMessage] = useState('');
  const [toggles, setToggles] = useState({
    rsvp: true,
    invitation: true,
    messages: true,
    weekly: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Settings updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="dash-header">
        <h1>System Settings</h1>
        <p>Configure system branding, business contact information{NOTIFICATIONS_ENABLED ? ', and notification channels' : ''}.</p>
      </div>

      {savedMessage && (
        <div className="settings-alert-banner">
          <span>✓ {savedMessage}</span>
        </div>
      )}

      <div className="dash-grid">
        <form className="card-widget settings-card" onSubmit={handleSave}>
          <div className="settings-card-header">
            <h3>General & System Branding</h3>
            <span className="settings-badge">Branding</span>
          </div>
          <div className="form-group">
            <label>System Title</label>
            <input defaultValue="Queen's Banquet Digital Invitation Management System" className="settings-input" />
          </div>
          <div className="form-group">
            <label>Brand Name</label>
            <input defaultValue="Queen's Banquet" className="settings-input" />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" defaultValue="hello@queensbanquetevents.ph" className="settings-input" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input defaultValue="+63 917 000 0000" className="settings-input" />
          </div>
          <div className="form-group">
            <label>Physical Address</label>
            <textarea style={{ minHeight: 80 }} defaultValue="123 Luxury Lane, BGC, Taguig City" className="settings-input" />
          </div>
          <Button variant="gold" type="submit" style={{ marginTop: 8 }}>Save Settings</Button>
        </form>

        {NOTIFICATIONS_ENABLED && (
          <div className="card-widget settings-card">
            <div className="settings-card-header">
              <h3>Notification Channels</h3>
              <span className="settings-badge">Alerts</span>
            </div>
            <p className="settings-desc">Choose which real-time alerts are sent to the admin dashboard.</p>
            <div className="toggle-list">
              {[
                { key: 'rsvp', label: 'New RSVP submissions', desc: 'Notify when guests respond to invitations' },
                { key: 'invitation', label: 'Invitation status changes', desc: 'Alert when clients publish or archive events' },
                { key: 'messages', label: 'Direct client messages', desc: 'Receive instant alerts for new inquiries' },
                { key: 'weekly', label: 'Weekly summary reports', desc: 'Receive weekly email digest of guest RSVPs' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="toggle-item" onClick={() => handleToggle(key)}>
                  <div className="toggle-info">
                    <strong>{label}</strong>
                    <span>{desc}</span>
                  </div>
                  <label className="switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={toggles[key]}
                      onChange={() => handleToggle(key)}
                    />
                    <span className="slider round" />
                  </label>
                </div>
              ))}
            </div>
            <Button variant="outline" style={{ marginTop: 20 }} onClick={handleSave}>Save Preferences</Button>
          </div>
        )}
      </div>
    </>
  );
}
