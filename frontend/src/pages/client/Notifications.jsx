const notifications = [
  { id: 1, title: 'New RSVP response', message: 'Pedro Reyes confirmed attendance for your wedding invitation.', time: '2 hours ago', unread: true },
  { id: 2, title: 'Invitation published', message: 'Your Wedding Invitation is now live and ready to share.', time: 'Yesterday', unread: true },
  { id: 3, title: 'Guest message', message: 'Ana left a message on your invitation page.', time: '2 days ago', unread: false },
  { id: 4, title: 'Weekly summary', message: 'You received 8 new RSVPs this week.', time: '3 days ago', unread: false },
];

export default function Notifications() {
  return (
    <>
      <div className="dash-header">
        <h1>Notifications</h1>
        <p>Stay updated on RSVPs, invitations, and guest activity.</p>
      </div>
      <div className="card-widget">
        {notifications.map((item) => (
          <div key={item.id} className="notification" style={item.unread ? { borderColor: 'rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.04)' } : undefined}>
            <div style={{ fontSize: 20, lineHeight: 1 }}>{item.unread ? '🔔' : '📬'}</div>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>{item.title}</strong>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{item.message}</p>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
