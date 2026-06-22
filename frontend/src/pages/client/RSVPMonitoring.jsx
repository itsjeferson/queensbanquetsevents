import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';
import Loader from '../../components/common/Loader/Loader';
import { useAuth } from '../../hooks/useAuth';
import { eventService, rsvpService } from '../../services/invitationService';

const emptyStats = { yes: 0, no: 0, maybe: 0, total_responses: 0, total_attending: 0 };

export default function RSVPMonitoring() {
  const { user } = useAuth();
  const { eventId: eventIdParam } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdParam || 'all');
  const [stats, setStats] = useState(emptyStats);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    eventService.getAll(user.id)
      .then((res) => setEvents(res.data || []))
      .catch(() => setEvents([]));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    const loadRsvps = selectedEventId === 'all'
      ? rsvpService.getByClient(user.id)
      : rsvpService.getByEvent(selectedEventId);

    loadRsvps
      .then((res) => {
        setStats(res.data?.stats || emptyStats);
        setRsvps(res.data?.rsvps || []);
      })
      .catch(() => {
        setStats(emptyStats);
        setRsvps([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id, selectedEventId]);

  useEffect(() => {
    if (eventIdParam) {
      setSelectedEventId(eventIdParam);
    }
  }, [eventIdParam]);

  const total = stats.total_responses || (stats.yes + stats.no + stats.maybe);
  const attendingPct = total ? Math.round((stats.yes / total) * 100) : 0;
  const showEventColumn = selectedEventId === 'all';

  return (
    <>
      <div className="dash-header">
        <h1>RSVP Monitoring</h1>
        <p>Track guest responses and attendance analytics for your invitations.</p>
      </div>

      {events.length > 0 && (
        <div className="card-widget" style={{ marginBottom: 24 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Filter by Invitation</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="all">All invitations</option>
              {events.map((event) => (
                <option key={event.id} value={String(event.id)}>
                  {event.event_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <Loader variant="page" label="Loading RSVP data..." />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="Attending" value={String(stats.yes)} trend={`${stats.total_attending} total guests`} trendClass="trend-up" />
            <StatCard label="Declined" value={String(stats.no)} trend="Not attending" />
            <StatCard label="Maybe" value={String(stats.maybe)} trend="Undecided" />
            <StatCard label="Response Rate" value={`${attendingPct}%`} trend={`${total} responses`} />
          </div>

          <div className="card-widget" style={{ marginBottom: 24 }}>
            <h3>Attendance Breakdown</h3>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span>Attending</span>
                <span>{stats.yes} ({attendingPct}%)</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${attendingPct}%` }} /></div>
            </div>
          </div>

          <div className="card-widget">
            <h3>RSVP Responses</h3>
            {rsvps.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No RSVP responses yet.</p>
            ) : (
              <DataTable
                columns={[
                  ...(showEventColumn ? [{ key: 'event_name', label: 'Invitation' }] : []),
                  { key: 'name', label: 'Guest' },
                  { key: 'attendance', label: 'Status' },
                  { key: 'meal_preference', label: 'Meal' },
                  { key: 'guest_count', label: 'Guests' },
                  { key: 'submitted_at', label: 'Date' },
                ]}
                data={rsvps}
                renderCell={(key, row) => {
                  if (key === 'attendance') return (
                    <span className={`badge ${row.attendance === 'yes' ? 'badge-green' : row.attendance === 'no' ? 'badge-red' : 'badge-blue'}`}>
                      {row.attendance}
                    </span>
                  );
                  if (key === 'submitted_at') return new Date(row.submitted_at).toLocaleDateString();
                  return row[key] ?? '—';
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
