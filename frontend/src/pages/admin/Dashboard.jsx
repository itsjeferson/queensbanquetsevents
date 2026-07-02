import { useEffect, useState } from 'react';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';
import Loader from '../../components/common/Loader/Loader';
import { reportService } from '../../services/reportService';

const emptyDashboard = {
  stats: [],
  recentInvitations: [],
  rsvpByCategory: [],
  generatedReports: [],
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const statusBadge = { Published: 'badge-green', Draft: 'badge-gray', Archived: 'badge-red', 'Pending Approval': 'badge-blue' };

  useEffect(() => {
    reportService.getAdminDashboard()
      .then((res) => setDashboard(res.data || emptyDashboard))
      .catch(() => setDashboard(emptyDashboard))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Queen&apos;s Banquet Digital Invitation Management System — overview and reports.</p>
      </div>
      {loading ? (
        <Loader variant="page" label="Loading dashboard..." />
      ) : (
        <>
          <div className="stats-grid">
            {dashboard.stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="dash-grid">
            <div className="card-widget">
              <h3>Recent Invitations</h3>
              {dashboard.recentInvitations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No invitations found in the database yet.</p>
              ) : (
                <DataTable
                  columns={[
                    { key: 'client', label: 'Client' },
                    { key: 'event', label: 'Invitation' },
                    { key: 'date', label: 'Date' },
                    { key: 'template', label: 'Template' },
                    { key: 'status', label: 'Status' },
                  ]}
                  data={dashboard.recentInvitations}
                  renderCell={(key, row) => {
                    if (key === 'event') return <strong>{row.event}</strong>;
                    if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
                    return row[key];
                  }}
                />
              )}
            </div>
            <div className="card-widget">
              <h3>RSVP by Category</h3>
              {dashboard.rsvpByCategory.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No RSVP data yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                  {dashboard.rsvpByCategory.map((item) => (
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
              )}
            </div>
          </div>
          <div className="card-widget">
            <h3>Generated Reports</h3>
            {dashboard.generatedReports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Publish invitations to generate RSVP reports.</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'invitation', label: 'Invitation' },
                  { key: 'guests', label: 'Guests' },
                  { key: 'attending', label: 'Attending' },
                  { key: 'declined', label: 'Declined' },
                  { key: 'generated', label: 'Generated' },
                ]}
                data={dashboard.generatedReports}
                renderCell={(key, row) => {
                  if (key === 'invitation') return <strong>{row.invitation}</strong>;
                  return row[key];
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
