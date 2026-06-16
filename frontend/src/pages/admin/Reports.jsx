import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';

const reportStats = [
  { label: 'Total Invitations', value: '89', trend: '↑ 15% vs last year', trendClass: 'trend-up' },
  { label: 'Total RSVPs', value: '1,284', trend: '74% attending', trendClass: 'trend-up' },
  { label: 'Active Templates', value: '18', trend: 'Across all categories' },
  { label: 'Gallery Assets', value: '236', trend: '14 added this month' },
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

export default function AdminReports() {
  return (
    <>
      <div className="dash-header">
        <h1>Reports</h1>
        <p>Invitation and RSVP performance overview.</p>
      </div>
      <div className="stats-grid">
        {reportStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="dash-grid" style={{ marginTop: 24 }}>
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
      </div>
    </>
  );
}
