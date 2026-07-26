import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/common/ConfirmDialog/ConfirmDialog';
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
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const confirmSignOut = () => {
    setLoggingOut(true);
    window.setTimeout(() => {
      logout();
      navigate('/login');
    }, 600);
  };

  const openLogout = () => setLogoutConfirmOpen(true);

  return (
    <>
      <DashboardShell
        navItems={adminNav}
        settingsPath="/admin/settings"
        onLogout={openLogout}
        footerItem={
          <button type="button" className="sidebar-item sidebar-logout-btn" onClick={openLogout}>
            <span className="sidebar-icon"><LogoutIcon /></span>
            <span className="sidebar-item-title">Sign Out</span>
          </button>
        }
      />
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        title="Sign Out"
        message="Are you sure you want to sign out of your session?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        loadingLabel="Signing out..."
        tone="danger"
        loading={loggingOut}
        onConfirm={confirmSignOut}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </>
  );
}
