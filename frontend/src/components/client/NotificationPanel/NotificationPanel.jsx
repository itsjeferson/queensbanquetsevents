export default function NotificationPanel({ notifications }) {
  return (
    <div>
      {notifications.map((n) => (
        <div key={n.id} className="notification">
          <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
          <div className="notif-body">
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
          <span className="notif-time" style={{ color: n.actionColor, fontWeight: 500, cursor: 'pointer' }}>
            {n.action} →
          </span>
        </div>
      ))}
    </div>
  );
}
