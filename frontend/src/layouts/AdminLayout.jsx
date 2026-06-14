import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar/Sidebar';
import PackageModal from '../components/common/Modal/PackageModal';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const adminNav = [
  { label: 'Main' },
  { path: '/admin', title: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/bookings', title: 'Bookings', icon: '📅' },
  { path: '/admin/payments', title: 'Payments', icon: '💳' },
  { path: '/admin/clients', title: 'Clients', icon: '👥' },
  { label: 'Content' },
  { path: '/admin/packages', title: 'Packages', icon: '📦' },
  { path: '/admin/gallery', title: 'Gallery', icon: '🖼️' },
  { path: '/admin/calendar', title: 'Calendar', icon: '🗓️' },
  { path: '/admin/content', title: 'CMS', icon: '✏️' },
  { path: '/admin/invitations', title: 'Invitation Templates', icon: '💌' },
  { label: 'System' },
  { path: '/admin/rsvp', title: 'RSVP Monitoring', icon: '📋' },
  { path: '/admin/reports', title: 'Reports', icon: '📈' },
  { path: '/admin/settings', title: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [packageModalOpen, setPackageModalOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        items={adminNav}
        footerItem={
          <button type="button" className="sidebar-item" onClick={handleSignOut}>
            <span className="icon">🚪</span> Sign Out
          </button>
        }
      />
      <main className="dashboard-main">
        <Outlet context={{ openPackageModal: () => setPackageModalOpen(true) }} />
      </main>
      <PackageModal isOpen={packageModalOpen} onClose={() => setPackageModalOpen(false)} />
    </div>
  );
}
