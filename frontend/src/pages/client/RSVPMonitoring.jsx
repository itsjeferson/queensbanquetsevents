import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StatCard from '../../components/common/Cards/StatCard';
import DataTable from '../../components/common/Table/DataTable';
import { rsvpService } from '../../services/invitationService';

const demoStats = { yes: 24, no: 5, maybe: 3, total_responses: 32, total_attending: 38 };
const demoRsvps = [
  { id: 1, name: 'Maria Garcia', email: 'maria@email.com', attendance: 'yes', meal_preference: 'beef', guest_count: 2, submitted_at: '2027-06-01' },
  { id: 2, name: 'Pedro Reyes', email: 'pedro@email.com', attendance: 'yes', meal_preference: 'chicken', guest_count: 1, submitted_at: '2027-06-02' },
  { id: 3, name: 'Ana Cruz', email: 'ana@email.com', attendance: 'no', meal_preference: null, guest_count: 0, submitted_at: '2027-06-03' },
];

export default function RSVPMonitoring() {
  const { id } = useParams();
  const [stats, setStats] = useState(demoStats);
  const [rsvps, setRsvps] = useState(demoRsvps);

  useEffect(() => {
    rsvpService.getByEvent(id).then((res) => {
      if (res.data?.stats) setStats(res.data.stats);
      if (res.data?.rsvps?.length) setRsvps(res.data.rsvps);
    }).catch(() => {});
  }, [id]);

  const total = stats.total_responses || (stats.yes + stats.no + stats.maybe);
  const attendingPct = total ? Math.round((stats.yes / total) * 100) : 0;

  return (
    <>
      <div className="dash-header">
        <h1>RSVP Monitoring</h1>
        <p>Track guest responses and attendance analytics.</p>
      </div>

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
        <DataTable
          columns={[
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
      </div>
    </>
  );
}
