import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClientsIcon,
  DashboardIcon,
  LogoutIcon,
  ManagementIcon,
  RsvpIcon,
  SettingsIcon,
} from '../components/common/Sidebar/sidebarIcons';
import { useAuth } from '../hooks/useAuth';
import DashboardShell from './DashboardShell';

// Gallery is temporarily hidden from the admin nav. The route/page still
// exist — re-add the entry below to bring it back.
const adminNav = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/admin/client-management', title: 'Client Management', icon: ClientsIcon },
  { path: '/admin/invitation-manager', title: 'Invitation Manager', icon: ManagementIcon },
  { path: '/admin/rsvp-monitoring', title: 'RSVP Monitoring', icon: RsvpIcon },
  { path: '/admin/calendar', title: 'Calendar', icon: CalendarIcon },
  { path: '/admin/settings', title: 'Settings', icon: SettingsIcon },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    logout();
    navigate('/login');
  };

  return (
    <DashboardShell
      navItems={adminNav}
      footerItem={
        <button type="button" className="sidebar-item" onClick={handleSignOut}>
          <span className="icon sidebar-icon"><LogoutIcon /></span>
          Logout
        </button>
      }
    />
  );
}
