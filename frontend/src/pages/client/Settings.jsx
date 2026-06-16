import Button from '../../components/common/Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();

  return (
    <>
      <div className="dash-header">
        <h1>Settings</h1>
        <p>Manage your account profile.</p>
      </div>
      <div className="card-widget" style={{ maxWidth: 640 }}>
        <h3>Profile</h3>
        <div className="form-group"><label>Full Name</label><input defaultValue={user?.name || ''} /></div>
        <div className="form-group"><label>Email Address</label><input type="email" defaultValue={user?.email || ''} /></div>
        <div className="form-group"><label>Phone Number</label><input defaultValue="" placeholder="+63 917 000 0000" /></div>
        <Button variant="gold">Save Profile</Button>
      </div>
    </>
  );
}
