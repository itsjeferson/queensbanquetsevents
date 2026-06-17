import { useEffect, useState } from 'react';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';
import { eventService, rsvpService } from '../../services/invitationService';

export default function AdminRsvpMonitoring() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    eventService.getAll().then((res) => {
      if (res.data?.length) setEvents(res.data);
    }).catch(() => {});
  }, []);

  const loadRsvp = async (eventId) => {
    setSelectedEvent(eventId);
    try {
      const res = await rsvpService.getByEvent(eventId);
      setStats(res.data.stats);
      setRsvps(res.data.rsvps);
    } catch {
      setStats(null);
      setRsvps([]);
    }
  };

  return (
    <>
      <div className="dash-header">
        <h1>RSVP Monitoring</h1>
        <p>Overview of RSVP responses across all events.</p>
      </div>

      <div className="card-widget">
        <h3>Events with Invitations</h3>
        <DataTable
          columns={[
            { key: 'event_name', label: 'Event' },
            { key: 'event_type', label: 'Type' },
            { key: 'client', label: 'Client' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: '' },
          ]}
          data={events}
          renderCell={(key, row) => {
            if (key === 'client') return `${row.first_name || ''} ${row.last_name || ''}`.trim() || '—';
            if (key === 'event_type') return <span className="badge badge-gold">{row.event_type}</span>;
            if (key === 'status') return <span className={`badge ${row.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{row.status}</span>;
            if (key === 'actions') return (
              <button type="button" className="action-btn" onClick={() => loadRsvp(row.id)}>View RSVPs</button>
            );
            return row[key];
          }}
        />
      </div>

      {selectedEvent && stats && (
        <>
          <div className="stats-grid" style={{ marginTop: 24 }}>
            <StatCard label="Attending" value={String(stats.yes)} trend={`${stats.total_attending} guests`} trendClass="trend-up" />
            <StatCard label="Declined" value={String(stats.no)} trend="Not attending" />
            <StatCard label="Maybe" value={String(stats.maybe)} trend="Undecided" />
            <StatCard label="Total Responses" value={String(stats.total_responses)} trend="All events" />
          </div>

          {rsvps.length > 0 && (
            <div className="card-widget">
              <h3>Recent RSVPs</h3>
              <DataTable
                columns={[
                  { key: 'name', label: 'Guest' },
                  { key: 'attendance', label: 'Status' },
                  { key: 'guest_count', label: 'Guests' },
                  { key: 'submitted_at', label: 'Date' },
                ]}
                data={rsvps}
                renderCell={(key, row) => {
                  if (key === 'attendance') return (
                    <span className={`badge ${row.attendance === 'yes' ? 'badge-green' : 'badge-red'}`}>{row.attendance}</span>
                  );
                  if (key === 'submitted_at') return new Date(row.submitted_at).toLocaleDateString();
                  return row[key] ?? '—';
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
