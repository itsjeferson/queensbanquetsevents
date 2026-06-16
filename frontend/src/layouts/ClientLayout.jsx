import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar/Sidebar';
import { useAuth } from '../hooks/useAuth';

const clientNav = [
  { path: '/client/dashboard', title: 'Dashboard', icon: 'DB', end: true },
  { path: '/client/invitation-manage', title: 'Invitation Manager', icon: 'IN' },
  { path: '/client/invitation-builder', title: 'Invitation Builder', icon: 'CR' },
  { path: '/client/rsvp-monitoring', title: 'RSVP Monitoring', icon: 'RS' },
  { path: '/client/settings', title: 'Settings', icon: 'ST' },
];

export default function ClientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        items={clientNav}
        footerItem={
          <button type="button" className="sidebar-item" onClick={handleSignOut}>
            <span className="icon">LO</span> Logout
          </button>
        }
      />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
