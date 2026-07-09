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
  TemplateIcon,
} from '../components/common/Sidebar/sidebarIcons';
import { useAuth } from '../hooks/useAuth';
import DashboardShell from './DashboardShell';

// Gallery is temporarily hidden from the admin nav. The route/page still
// exist — re-add the entry below to bring it back.
const adminNav = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/admin/client-management', title: 'Client Management', icon: ClientsIcon },
  { path: '/admin/invitation-manager', title: 'Invitation Manager', icon: ManagementIcon },
  // { path: '/admin/invitation-templates', title: 'Templates', icon: TemplateIcon },
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

  return (
    <>
      <DashboardShell
        navItems={adminNav}
        footerItem={
          <button type="button" className="sidebar-item" onClick={() => setLogoutConfirmOpen(true)}>
            <span className="icon sidebar-icon"><LogoutIcon /></span>
            Logout
          </button>
        }
      />
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        title="Logout Confirmation"
        message="Are you sure you want to do logout?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        loadingLabel="Logging out..."
        loading={loggingOut}
        onConfirm={confirmSignOut}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </>
  );
}
