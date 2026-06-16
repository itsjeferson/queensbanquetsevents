import { Link } from 'react-router-dom';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';

const invitations = [
  { id: 1, event: 'Wedding Invitation', date: 'Dec 28, 2026', template: 'Classic Gold', status: 'Published' },
  { id: 2, event: 'Debut Invitation', date: 'Jan 5, 2027', template: 'Pink Rose', status: 'Draft' },
  { id: 3, event: 'Birthday Invitation', date: 'Feb 15, 2027', template: 'Kids Theme', status: 'Editing' },
];

const workflow = [
  { title: 'Create invitation', date: 'Choose event details and URL slug' },
  { title: 'Customize design', date: 'Upload photos, music, and background video' },
  { title: 'Share invitation link', date: 'Send public link or QR code to guests' },
  { title: 'Monitor RSVPs', date: 'Track responses and guest activity' },
];

export default function ClientDashboard() {
  const statusBadge = { Published: 'badge-green', Draft: 'badge-gray', Editing: 'badge-blue' };

  return (
    <>
      <div className="dash-header">
        <h1>Dashboard</h1>
        <p>Create, customize, share, and monitor your digital invitations.</p>
      </div>
      <div className="stats-grid">
        <StatCard label="My Invitations" value="3" trend="1 published" />
        <StatCard label="RSVP Responses" value="32" trend="24 attending" trendClass="trend-up" />
        <StatCard label="Guest Records" value="120" trend="88 confirmed contacts" />
        <StatCard label="Shared Links" value="2" trend="QR and public URL active" />
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
            <a href="/#/invite/john-jane" target="_blank" rel="noreferrer" className="btn btn-outline">Preview Demo</a>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card-widget">
          <h3>My Invitations</h3>
          <DataTable
            columns={[
              { key: 'event', label: 'Invitation' },
              { key: 'date', label: 'Event Date' },
              { key: 'template', label: 'Template' },
              { key: 'status', label: 'Status' },
            ]}
            data={invitations}
            renderCell={(key, row) => {
              if (key === 'event') return <strong>{row.event}</strong>;
              if (key === 'status') return <span className={`badge ${statusBadge[row.status]}`}>{row.status}</span>;
              return row[key];
            }}
          />
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
  );
}
