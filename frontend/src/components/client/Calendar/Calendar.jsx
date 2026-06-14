const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ month = 'December 2024', days = [], events = [] }) {
  return (
    <div className="dash-grid">
      <div className="card-widget">
        <h3>{month}</h3>
        <div className="calendar-grid">
          {DAYS.map((d) => <div key={d} className="cal-header">{d}</div>)}
          {days.map((day, i) => (
            <div
              key={i}
              className={`cal-day${day.empty ? ' empty' : ''}${day.today ? ' today' : ''}${day.booked ? ' booked' : ''}${day.available ? ' available' : ''}`}
            >
              {day.num}
              {day.booked && <div className="cal-dot" />}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: 'var(--gold)' }} /> Today</div>
          <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: 'rgba(220,53,69,0.4)' }} /> Booked</div>
          <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: 'rgba(40,167,69,0.4)' }} /> Available</div>
        </div>
      </div>
      <div className="card-widget">
        <h3>{month.split(' ')[0]} Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.map((e) => (
            <div key={e.title} style={{ padding: 14, border: '1px solid var(--border-soft)', borderRadius: 10, borderLeft: `4px solid ${e.color}` }}>
              <strong style={{ fontSize: 14 }}>{e.title}</strong>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{e.details}</p>
              <p style={{ fontSize: 12, color: 'var(--gold-dark)', marginTop: 4 }}>Coord: {e.coordinator}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
