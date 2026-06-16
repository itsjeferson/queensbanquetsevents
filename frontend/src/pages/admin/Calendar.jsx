const decemberDays = [
  ...Array(6).fill({ empty: true }),
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({ num: n })),
  { num: 8, booked: true },
  ...[9, 10, 11, 12, 13, 14].map((n) => ({ num: n })),
  { num: 15, booked: true },
  ...[16, 17, 18, 19, 20].map((n) => ({ num: n })),
  { num: 21, today: true },
  ...[22, 23, 24, 25, 26, 27].map((n) => ({ num: n })),
  { num: 28, booked: true },
  { num: 29 }, { num: 31 },
];

const events = [
  { title: 'Wedding — Santos', details: 'Dec 28 • Classic Gold • 120 guests', coordinator: 'Isabella Santos', color: 'var(--gold)' },
  { title: 'Debut — Lim', details: 'Dec 15 • Pink Rose • 80 guests', coordinator: 'Miguel Cruz', color: '#DC3545' },
  { title: 'Birthday — Garcia', details: 'Dec 8 • Kids Theme • 40 guests', coordinator: 'Clara Reyes', color: '#0050A0' },
];

function CalendarWidget({ month, days, events: calendarEvents }) {
  return (
    <div className="dash-grid">
      <div className="card-widget">
        <h3>{month}</h3>
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
                background: day.today ? 'var(--gold)' : day.booked ? 'rgba(212,175,55,0.15)' : day.empty ? 'transparent' : 'var(--cream)',
                color: day.today ? 'white' : 'var(--black)',
                fontWeight: day.today || day.booked ? 600 : 400,
              }}
            >
              {day.num || ''}
            </div>
          ))}
        </div>
      </div>
      <div className="card-widget">
        <h3>Upcoming Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          {calendarEvents.map((event) => (
            <div key={event.title} style={{ paddingLeft: 12, borderLeft: `3px solid ${event.color}` }}>
              <strong style={{ fontSize: 14, display: 'block' }}>{event.title}</strong>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{event.details}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>Coordinator: {event.coordinator}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminCalendar() {
  return (
    <>
      <div className="dash-header">
        <h1>Calendar</h1>
        <p>View scheduled invitation events and manage availability.</p>
      </div>
      <CalendarWidget month="December 2026" days={decemberDays} events={events} />
    </>
  );
}
