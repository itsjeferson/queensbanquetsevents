import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/common/Table/DataTable';
import { eventService } from '../../services/invitationService';
import { useAuth } from '../../hooks/useAuth';

const demoEvents = [
  { id: 1, event_name: 'John & Jane Wedding', event_type: 'wedding', event_date: '2027-07-25', slug: 'john-jane', status: 'published' },
  { id: 2, event_name: 'Maria at 18', event_type: 'debut', event_date: '2027-03-15', slug: 'maria-at-18', status: 'draft' },
];

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState(demoEvents);

  useEffect(() => {
    eventService.getAll(user?.id).then((res) => {
      if (res.data?.length) setEvents(res.data);
    }).catch(() => {});
  }, [user?.id]);

  const statusBadge = { published: 'badge-green', draft: 'badge-gray', archived: 'badge-red' };

  return (
    <>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Events</h1>
          <p>Manage your event invitations and guest lists.</p>
        </div>
        <Link to="/client/invitations/builder" className="btn btn-gold">+ Create Invitation</Link>
      </div>

      <div className="card-widget">
        <DataTable
          columns={[
            { key: 'event_name', label: 'Event' },
            { key: 'event_type', label: 'Type' },
            { key: 'event_date', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={events}
          renderCell={(key, row) => {
            if (key === 'event_name') return <strong>{row.event_name}</strong>;
            if (key === 'event_type') return <span className="badge badge-gold">{row.event_type}</span>;
            if (key === 'event_date') return new Date(row.event_date).toLocaleDateString();
            if (key === 'status') return <span className={`badge ${statusBadge[row.status] || 'badge-gray'}`}>{row.status}</span>;
            if (key === 'actions') return (
              <span>
                <Link to={`/client/invitations/${row.id}`} className="action-btn">Manage</Link>
                {row.status === 'published' && row.slug && (
                  <a href={`/invite/${row.slug}`} target="_blank" rel="noreferrer" className="action-btn">View</a>
                )}
              </span>
            );
            return row[key];
          }}
        />
      </div>
    </>
  );
}
