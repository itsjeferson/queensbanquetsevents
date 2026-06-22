import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader/Loader';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';
import { useAuth } from '../../hooks/useAuth';
import { reportService } from '../../services/reportService';
import { getClientPreviewSlug, getPreviewPath, saveClientPreviewSlug } from '../../utils/invitationPreview';

const workflow = [
  { title: 'Create invitation', date: 'Choose event details and URL slug' },
  { title: 'Customize design', date: 'Upload photos, music, and background video' },
  { title: 'Share invitation link', date: 'Send public link or QR code to guests' },
  { title: 'Monitor RSVPs', date: 'Track responses and guest activity' },
];

const emptyDashboard = {
  stats: [],
  invitations: [],
  previewSlug: null,
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [previewSlug, setPreviewSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const statusBadge = { Published: 'badge-green', Draft: 'badge-gray', Archived: 'badge-red' };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    reportService.getClientDashboard(user.id)
      .then((res) => {
        const data = res.data || emptyDashboard;
        setDashboard(data);
        const slug = data.previewSlug || getClientPreviewSlug(user.id);
        if (slug) {
          setPreviewSlug(slug);
          saveClientPreviewSlug(user.id, slug);
        }
      })
      .catch(() => {
        setDashboard(emptyDashboard);
        const storedSlug = getClientPreviewSlug(user.id);
        if (storedSlug) setPreviewSlug(storedSlug);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <>
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Create, customize, share, and monitor your digital invitations.</p>
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

          <div className="card-widget" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h3>Digital Invitation Workspace</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  Build an editable invitation page with photos, music, video, RSVP collection, and guest monitoring.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link to="/client/invitation-builder" className="btn btn-gold">Create Invitation</Link>
                {previewSlug ? (
                  <a href={getPreviewPath(previewSlug)} target="_blank" rel="noreferrer" className="btn btn-outline">
                    Preview Invitation
                  </a>
                ) : (
                  <button type="button" className="btn btn-outline" disabled title="Create an invitation first">
                    Preview Invitation
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="dash-grid">
            <div className="card-widget">
              <h3>My Invitations</h3>
              {dashboard.invitations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No invitations yet. Create your first invitation to get started.</p>
              ) : (
                <DataTable
                  columns={[
                    { key: 'event', label: 'Invitation' },
                    { key: 'date', label: 'Event Date' },
                    { key: 'template', label: 'Template' },
                    { key: 'status', label: 'Status' },
                  ]}
                  data={dashboard.invitations}
                  renderCell={(key, row) => {
                    if (key === 'event') return <strong>{row.event}</strong>;
                    if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
                    return row[key];
                  }}
                />
              )}
            </div>
            <div className="card-widget">
              <h3>Invitation Workflow</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                {workflow.map((item, index) => (
                  <div key={item.title} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                      {index + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: 14, display: 'block' }}>{item.title}</strong>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
