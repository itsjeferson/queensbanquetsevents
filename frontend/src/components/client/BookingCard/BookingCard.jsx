export default function BookingCard({ booking }) {
  const statusClass = {
    Confirmed: 'badge-gold',
    Pending: 'badge-blue',
    Completed: 'badge-green',
    Cancelled: 'badge-red',
  }[booking.status] || 'badge-gray';

  return (
    <div style={{ padding: 14, border: '1px solid var(--border-soft)', borderRadius: 10, borderLeft: `4px solid ${booking.color || 'var(--gold)'}` }}>
      <strong style={{ fontSize: 14 }}>{booking.event}</strong>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{booking.date} • {booking.package} • {booking.guests} guests</p>
      {booking.coordinator && (
        <p style={{ fontSize: 12, color: 'var(--gold-dark)', marginTop: 4 }}>Coord: {booking.coordinator}</p>
      )}
      <span className={`badge ${statusClass}`} style={{ marginTop: 8 }}>{booking.status}</span>
    </div>
  );
}
