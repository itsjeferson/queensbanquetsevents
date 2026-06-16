import { Outlet, useNavigate } from 'react-router-dom';
import PanelNavbar from '../components/common/Navbar/PanelNavbar';
import Sidebar from '../components/common/Sidebar/Sidebar';
import {
  BuilderIcon,
  DashboardIcon,
  LogoutIcon,
  ManagementIcon,
  NotificationIcon,
  RsvpIcon,
} from '../components/common/Sidebar/sidebarIcons';
import { useAuth } from '../hooks/useAuth';

const clientNav = [
  { path: '/client/dashboard', title: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/client/invitation-builder', title: 'Invitation Builder', icon: BuilderIcon },
  { path: '/client/invitation-manage', title: 'Invitation Management', icon: ManagementIcon },
  { path: '/client/rsvp-monitoring', title: 'RSVP Monitoring', icon: RsvpIcon },
  { path: '/client/notifications', title: 'Notifications', icon: NotificationIcon },
];

export default function ClientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <PanelNavbar />
      <div className="dashboard-layout">
        <Sidebar
          items={clientNav}
          footerItem={
            <button type="button" className="sidebar-item" onClick={handleSignOut}>
              <span className="icon sidebar-icon"><LogoutIcon /></span>
              Logout
            </button>
          }
        />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
