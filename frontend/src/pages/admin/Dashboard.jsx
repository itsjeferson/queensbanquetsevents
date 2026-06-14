import DashboardStats from '../../components/admin/DashboardStats/DashboardStats';
import BookingTable from '../../components/admin/BookingTable/BookingTable';
import NotificationPanel from '../../components/client/NotificationPanel/NotificationPanel';
import RevenueChart from '../../components/admin/Charts/RevenueChart';

const stats = [
  { label: 'Total Bookings', value: '48', trend: '↑ 12% this month', trendClass: 'trend-up' },
  { label: 'Revenue (Nov)', value: '₱1.2M', trend: '↑ 8% vs Oct', trendClass: 'trend-up' },
  { label: 'Active Clients', value: '36', trend: '👥 12 new' },
  { label: 'Pending Payments', value: '7', trend: '↓ Needs review', trendClass: 'trend-down' },
];

const bookings = [
  { id: '001', client: 'Maria Santos', event: 'Wedding', date: 'Dec 28', package: 'Signature', guests: 120, status: 'Confirmed' },
  { id: '002', client: 'John Lim', event: 'Debut', date: 'Jan 3', package: 'Grand', guests: 200, status: 'Pending' },
  { id: '003', client: 'Apex Corp.', event: 'Corporate', date: 'Jan 10', package: 'Essential', guests: 80, status: 'Confirmed' },
  { id: '004', client: 'Ana Garcia', event: 'Birthday', date: 'Jan 15', package: 'Signature', guests: 100, status: 'Cancelled' },
];

const notifications = [
  { id: 1, icon: '💳', bg: 'rgba(212,175,55,0.1)', title: '7 Payments to Verify', message: 'Uploaded receipts awaiting approval', action: 'Review', actionColor: 'var(--gold-dark)' },
  { id: 2, icon: '📅', bg: 'rgba(0,100,200,0.1)', title: '3 New Bookings', message: 'Require confirmation today', action: 'View', actionColor: '#0050A0' },
  { id: 3, icon: '💬', bg: 'rgba(40,167,69,0.1)', title: '12 Unread Messages', message: 'From 5 different clients', action: 'Open', actionColor: '#1B7A35' },
];

const revenue = [
  { label: 'Weddings', value: '₱680,000', percent: 68 },
  { label: 'Corporate', value: '₱320,000', percent: 32 },
  { label: 'Debut/Birthday', value: '₱200,000', percent: 20 },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="dash-header">
        <h1>Admin Dashboard</h1>
        <p>Velura Events Management System — Overview</p>
      </div>
      <DashboardStats stats={stats} />
      <div className="dash-grid">
        <BookingTable bookings={bookings} />
        <div>
          <div className="card-widget" style={{ marginBottom: 20 }}>
            <h3>Pending Actions</h3>
            <NotificationPanel notifications={notifications} />
          </div>
          <RevenueChart items={revenue} />
        </div>
      </div>
    </>
  );
}
