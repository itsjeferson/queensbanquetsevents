import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();

  return (
    <>
      <div className="dash-header">
        <h1>Settings</h1>
        <p>Manage your account and notification preferences.</p>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>Profile</h3>
          <div className="form-group"><label>Full Name</label><input defaultValue={user?.name || ''} /></div>
          <div className="form-group"><label>Email Address</label><input type="email" defaultValue={user?.email || ''} /></div>
          <div className="form-group"><label>Phone Number</label><input defaultValue="" placeholder="+63 917 000 0000" /></div>
          <Button variant="gold">Save Profile</Button>
        </div>
        <div className="card-widget">
          <h3>Notification Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['New RSVP responses', 'Invitation published', 'Guest messages', 'Weekly summary'].map((label, i) => (
              <label key={label} style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'none', fontWeight: 400, fontSize: 14, color: 'var(--black)', cursor: 'pointer' }}>
                {label} <input type="checkbox" defaultChecked={i < 3} />
              </label>
            ))}
          </div>
          <Button variant="outline" style={{ marginTop: 20 }}>Save Preferences</Button>
        </div>
      </div>
    </>
  );
}
