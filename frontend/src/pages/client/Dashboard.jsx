import { Link } from 'react-router-dom';
import StatCard from '../../components/common/Cards/StatCard';
import EventTimeline from '../../components/client/EventTimeline/EventTimeline';
import DataTable from '../../components/common/Table/DataTable';

const upcomingEvents = [
  { id: 1, event: 'Wedding', date: 'Dec 28, 2024', package: 'Signature', status: 'Confirmed' },
  { id: 2, event: 'Post-Wedding', date: 'Jan 5, 2025', package: 'Essential', status: 'Pending' },
  { id: 3, event: 'Engagement', date: 'Nov 15, 2024', package: 'Essential', status: 'Completed' },
];

const timeline = [
  { title: 'Venue Visit', date: 'Dec 10, 2024 — 2:00 PM' },
  { title: 'Menu Tasting', date: 'Dec 15, 2024 — 11:00 AM' },
  { title: 'Final Briefing', date: 'Dec 26, 2024 — 10:00 AM' },
  { title: 'Wedding Day 🎉', date: 'Dec 28, 2024' },
];

export default function ClientDashboard() {
  const statusBadge = { Confirmed: 'badge-gold', Pending: 'badge-blue', Completed: 'badge-green' };

  return (
    <>
      <div className="dash-header">
        <h1>Welcome back, Maria! 👋</h1>
        <p>Here&apos;s what&apos;s happening with your upcoming events.</p>
      </div>
      <div className="stats-grid">
        <StatCard label="Total Bookings" value="3" trend="📅 All events" />
        <StatCard label="Upcoming" value="2" trend="↑ Next: Dec 28" trendClass="trend-up" />
        <StatCard label="Payment Status" value="Partial" trend="₱45,000 due" />
        <StatCard label="Messages" value="4" trend="2 unread" />
        <StatCard label="RSVP Responses" value="32" trend="24 attending" trendClass="trend-up" />
      </div>

      <div className="card-widget" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Digital Event Invitation</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Create a personalized event website for your guests</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/client/invitations/builder" className="btn btn-gold">+ Create Invitation</Link>
            <a href="/invite/john-jane" target="_blank" rel="noreferrer" className="btn btn-outline">Preview Demo</a>
          </div>
        </div>
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>My Upcoming Events</h3>
          <DataTable
            columns={[
              { key: 'event', label: 'Event' },
              { key: 'date', label: 'Date' },
              { key: 'package', label: 'Package' },
              { key: 'status', label: 'Status' },
            ]}
            data={upcomingEvents}
            renderCell={(key, row) => {
              if (key === 'event') return <strong>{row.event}</strong>;
              if (key === 'status') return <span className={`badge ${statusBadge[row.status]}`}>{row.status}</span>;
              return row[key];
            }}
          />
        </div>
        <div className="card-widget">
          <h3>Event Timeline</h3>
          <EventTimeline items={timeline} />
        </div>
      </div>
    </>
  );
}
