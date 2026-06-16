import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar/Sidebar';
import { useAuth } from '../hooks/useAuth';

const adminNav = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'DB', end: true },
  { path: '/admin/rsvp-monitoring', title: 'RSVP Monitoring', icon: 'RS' },
  { path: '/admin/calendar', title: 'Calendar', icon: 'CA' },
  { path: '/admin/invitation-templates', title: 'Invitation Templates', icon: 'TP' },
  { path: '/admin/gallery', title: 'Gallery', icon: 'GA' },
  { path: '/admin/reports', title: 'Reports', icon: 'RP' },
  { path: '/admin/settings', title: 'Settings', icon: 'ST' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        items={adminNav}
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
