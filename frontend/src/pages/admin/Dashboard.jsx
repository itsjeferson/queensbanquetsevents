import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';

const stats = [
  { label: 'Total Invitations', value: '89', trend: '↑ 15% vs last year', trendClass: 'trend-up' },
  { label: 'Published Invitations', value: '42', trend: '8 published this month', trendClass: 'trend-up' },
  { label: 'Total RSVPs', value: '1,284', trend: '74% attending', trendClass: 'trend-up' },
  { label: 'Gallery Assets', value: '236', trend: '14 pending review' },
];

const invitations = [
  { id: 'INV-001', client: 'Maria Santos', event: 'Wedding Invitation', date: 'Dec 28', template: 'Classic Gold', guests: 120, status: 'Published' },
  { id: 'INV-002', client: 'John Lim', event: 'Debut Invitation', date: 'Jan 3', template: 'Pink Rose', guests: 200, status: 'Draft' },
  { id: 'INV-003', client: 'Apex Corp.', event: 'Corporate Event Invite', date: 'Jan 10', template: 'Modern Minimalist', guests: 80, status: 'Published' },
  { id: 'INV-004', client: 'Ana Garcia', event: 'Birthday Invitation', date: 'Jan 15', template: 'Kids Theme', guests: 100, status: 'Review' },
];

const rsvpByCategory = [
  { label: 'Weddings', value: '680 RSVPs', percent: 68 },
  { label: 'Debuts', value: '320 RSVPs', percent: 32 },
  { label: 'Birthdays', value: '200 RSVPs', percent: 20 },
];

const recentReports = [
  { id: 1, invitation: 'John & Jane Wedding', guests: 120, attending: 98, declined: 22, generated: 'Jun 10, 2026' },
  { id: 2, invitation: 'Maria at 18', guests: 200, attending: 164, declined: 36, generated: 'Jun 8, 2026' },
  { id: 3, invitation: 'Josh 7th Birthday', guests: 50, attending: 42, declined: 8, generated: 'Jun 5, 2026' },
];

export default function AdminDashboard() {
  const statusBadge = { Published: 'badge-green', Draft: 'badge-gray', Review: 'badge-blue' };

  return (
    <>
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Queen&apos;s Banquet Digital Invitation Management System — overview and reports.</p>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="dash-grid">
        <div className="card-widget">
          <h3>Recent Invitations</h3>
          <DataTable
            columns={[
              { key: 'client', label: 'Client' },
              { key: 'event', label: 'Invitation' },
              { key: 'date', label: 'Date' },
              { key: 'template', label: 'Template' },
              { key: 'status', label: 'Status' },
            ]}
            data={invitations}
            renderCell={(key, row) => {
              if (key === 'event') return <strong>{row.event}</strong>;
              if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
              return row[key];
            }}
          />
        </div>
        <div className="card-widget">
          <h3>RSVP by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            {rsvpByCategory.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-soft)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${item.percent}%`, background: 'var(--gold)', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-widget">
        <h3>Generated Reports</h3>
        <DataTable
          columns={[
            { key: 'invitation', label: 'Invitation' },
            { key: 'guests', label: 'Guests' },
            { key: 'attending', label: 'Attending' },
            { key: 'declined', label: 'Declined' },
            { key: 'generated', label: 'Generated' },
          ]}
          data={recentReports}
          renderCell={(key, row) => {
            if (key === 'invitation') return <strong>{row.invitation}</strong>;
            return row[key];
          }}
        />
      </div>
    </>
  );
}
