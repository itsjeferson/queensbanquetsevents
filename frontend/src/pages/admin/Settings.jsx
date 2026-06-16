import Button from '../../components/common/Button/Button';

export default function Settings() {
  return (
    <>
      <div className="dash-header">
        <h1>System Settings</h1>
        <p>Configure system preferences and notifications.</p>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>General Settings</h3>
          <div className="form-group"><label>System Name</label><input defaultValue="Queen's Banquet Digital Invitation Management System" /></div>
          <div className="form-group"><label>Brand Name</label><input defaultValue="Queen's Banquet" /></div>
          <div className="form-group"><label>Contact Email</label><input defaultValue="hello@queensbanquetevents.ph" /></div>
          <div className="form-group"><label>Phone Number</label><input defaultValue="+63 917 000 0000" /></div>
          <div className="form-group"><label>Address</label><textarea style={{ minHeight: 80 }} defaultValue="123 Luxury Lane, BGC, Taguig City" /></div>
          <Button variant="gold">Save Settings</Button>
        </div>
        <div className="card-widget">
          <h3>Notification Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['New RSVP notifications', 'Invitation publish alerts', 'Client messages', 'Weekly reports'].map((label, i) => (
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
