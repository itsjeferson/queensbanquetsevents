import { Outlet, useNavigate } from 'react-router-dom';
import PanelNavbar from '../components/common/Navbar/PanelNavbar';
import Sidebar from '../components/common/Sidebar/Sidebar';
import {
  CalendarIcon,
  ClientsIcon,
  DashboardIcon,
  GalleryIcon,
  LogoutIcon,
  ManagementIcon,
  RsvpIcon,
  SettingsIcon,
  TemplateIcon,
} from '../components/common/Sidebar/sidebarIcons';
import { useAuth } from '../hooks/useAuth';

const adminNav = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/admin/client-management', title: 'Client Management', icon: ClientsIcon },
  { path: '/admin/invitation-manager', title: 'Invitation Manager', icon: ManagementIcon },
  { path: '/admin/rsvp-monitoring', title: 'RSVP Monitoring', icon: RsvpIcon },
  { path: '/admin/calendar', title: 'Calendar', icon: CalendarIcon },
  { path: '/admin/invitation-templates', title: 'Invitation Templates', icon: TemplateIcon },
  { path: '/admin/gallery', title: 'Gallery', icon: GalleryIcon },
  { path: '/admin/settings', title: 'Settings', icon: SettingsIcon },
];

export default function AdminLayout() {
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
          items={adminNav}
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
