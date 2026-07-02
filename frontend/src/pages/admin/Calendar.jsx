import { useEffect, useState } from 'react';
import Loader from '../../components/common/Loader/Loader';
import { reportService } from '../../services/reportService';

function CalendarWidget({ monthLabel, days, events, onPrev, onNext }) {
  return (
    <div className="dash-grid">
      <div className="card-widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>{monthLabel}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-outline" onClick={onPrev}>Previous</button>
            <button type="button" className="btn btn-outline" onClick={onNext}>Next</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 16 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{day}</div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                fontSize: 14,
                background: day.today ? 'var(--gold)' : day.booked ? 'var(--danger-bg)' : day.empty ? 'transparent' : 'var(--ivory)',
                color: day.today ? 'var(--black)' : day.booked ? 'var(--danger)' : 'var(--black)',
                fontWeight: day.today || day.booked ? 600 : 400,
                boxShadow: day.today ? 'inset 0 0 0 2px var(--gold-dark)' : 'none',
              }}
            >
              {day.num || ''}
            </div>
          ))}
        </div>
      </div>
      <div className="card-widget">
        <h3>Upcoming Events</h3>
        {events.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>No upcoming published events yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            {events.map((event) => (
              <div key={event.id} style={{ paddingLeft: 12, borderLeft: `3px solid ${event.color}` }}>
                <strong style={{ fontSize: 14, display: 'block' }}>{event.title}</strong>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{event.details}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                  Event: {event.event_name}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                  Client: {event.coordinator}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const emptyCalendar = {
  monthLabel: '',
  days: [],
  events: [],
};

export default function AdminCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calendar, setCalendar] = useState(emptyCalendar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportService.getCalendar(year, month)
      .then((res) => setCalendar(res.data || emptyCalendar))
      .catch(() => setCalendar(emptyCalendar))
      .finally(() => setLoading(false));
  }, [year, month]);

  const shiftMonth = (offset) => {
    const date = new Date(year, month - 1 + offset, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  return (
    <>
      <div className="dash-header">
        <h1>Calendar</h1>
        <p>View scheduled invitation events from the database.</p>
      </div>
      {loading ? (
        <Loader variant="page" label="Loading calendar..." />
      ) : (
        <CalendarWidget
          monthLabel={calendar.monthLabel}
          days={calendar.days}
          events={calendar.events}
          onPrev={() => shiftMonth(-1)}
          onNext={() => shiftMonth(1)}
        />
      )}
    </>
  );
}
