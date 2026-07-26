import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/common/ConfirmDialog/ConfirmDialog';
import {
  BuilderIcon,
  DashboardIcon,
  LogoutIcon,
  ManagementIcon,
  NotificationIcon,
  RsvpIcon,
} from '../components/common/Sidebar/sidebarIcons';
import NotificationPanel from '../components/notifications/NotificationPanel';
import { NOTIFICATIONS_ENABLED } from '../config/features';
import { NotificationProvider, useNotifications } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';
import DashboardShell from './DashboardShell';

const clientNavBase = [
  { path: '/client/dashboard', title: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/client/invitation-builder', title: 'Invitation Builder', icon: BuilderIcon },
  { path: '/client/invitation-manage', title: 'Invitation Management', icon: ManagementIcon },
  { path: '/client/rsvp-monitoring', title: 'RSVP Monitoring', icon: RsvpIcon },
];

const notificationsNavItem = {
  path: '/client/notifications',
  title: 'Notifications',
  icon: NotificationIcon,
};

function ClientLayoutShell({ navItems }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, openPanel } = useNotifications();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItemsWithBadge = useMemo(
    () => navItems.map((item) => (
      item.path === '/client/notifications'
        ? { ...item, badge: unreadCount }
        : item
    )),
    [navItems, unreadCount],
  );

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
        navItems={navItemsWithBadge}
        settingsPath="/client/settings"
        onLogout={openLogout}
        footerItem={
          <button type="button" className="sidebar-item sidebar-logout-btn" onClick={openLogout}>
            <span className="sidebar-icon"><LogoutIcon /></span>
            <span className="sidebar-item-title">Sign Out</span>
          </button>
        }
        unreadCount={unreadCount}
        onOpenNotifications={openPanel}
        notificationPanel={<NotificationPanel />}
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

function ClientLayoutContent() {
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
        navItems={clientNavBase}
        settingsPath="/client/settings"
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

export default function ClientLayout() {
  if (!NOTIFICATIONS_ENABLED) {
    return <ClientLayoutContent />;
  }

  const navItems = [...clientNavBase, notificationsNavItem];

  return (
    <NotificationProvider>
      <ClientLayoutShell navItems={navItems} />
    </NotificationProvider>
  );
}
