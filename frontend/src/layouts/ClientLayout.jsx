import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar/Sidebar';
import BookingModal from '../components/common/Modal/BookingModal';
import { useAuth } from '../hooks/useAuth';

const clientNav = [
  { path: '/client', title: 'Dashboard', icon: '📊', end: true },
  { path: '/client/bookings', title: 'My Bookings', icon: '📅' },
  { path: '/client/events', title: 'My Events', icon: '🎉' },
  { path: '/client/invitations', title: 'Event Invitations', icon: '💌' },
  { path: '/client/payments', title: 'Payments', icon: '💳' },
  { path: '/client/messages', title: 'Messages', icon: '💬' },
  { path: '/client/notifications', title: 'Notifications', icon: '🔔' },
  { path: '/client/calendar', title: 'Calendar', icon: '🗓️' },
  { path: '/client/profile', title: 'Profile', icon: '👤' },
];

export default function ClientLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        items={clientNav}
        footerItem={
          <button type="button" className="sidebar-item" onClick={handleSignOut}>
            <span className="icon">🚪</span> Sign Out
          </button>
        }
      />
      <main className="dashboard-main">
        <Outlet />
      </main>
      <BookingModal />
    </div>
  );
}
