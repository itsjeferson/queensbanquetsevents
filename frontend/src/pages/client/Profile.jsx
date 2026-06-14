import Button from '../../components/common/Button/Button';

export default function Profile() {
  return (
    <>
      <div className="dash-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences.</p>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-soft)' }}>
            <div className="profile-avatar">MS</div>
            <div>
              <strong style={{ fontSize: 18, display: 'block' }}>Maria Santos</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Client since November 2024</span>
            </div>
            <Button variant="outline" style={{ marginLeft: 'auto' }}>Change Photo</Button>
          </div>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input defaultValue="Maria" /></div>
            <div className="form-group"><label>Last Name</label><input defaultValue="Santos" /></div>
          </div>
          <div className="form-group"><label>Email</label><input type="email" defaultValue="maria.santos@email.com" /></div>
          <div className="form-group"><label>Phone</label><input defaultValue="+63 917 123 4567" /></div>
          <Button variant="gold">Save Changes</Button>
        </div>
        <div className="card-widget">
          <h3>Security</h3>
          <div className="form-group"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
          <div className="form-group"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
          <Button variant="outline">Update Password</Button>
        </div>
      </div>
    </>
  );
}
