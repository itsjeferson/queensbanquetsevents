const notifications = [
  { id: 1, icon: '📅', bg: 'rgba(212,175,55,0.1)', title: 'Venue Visit Reminder', message: 'Your venue visit is scheduled for Dec 10 at 2:00 PM', time: '2 hours ago' },
  { id: 2, icon: '💳', bg: 'rgba(0,100,200,0.1)', title: 'Payment Due', message: 'Final payment of ₱23,750 is due on Dec 15', time: '1 day ago' },
  { id: 3, icon: '💬', bg: 'rgba(40,167,69,0.1)', title: 'New Message', message: 'Isabella Santos sent you a message', time: '3 days ago' },
];

export default function Notifications() {
  return (
    <>
      <div className="dash-header">
        <h1>Notifications</h1>
        <p>Stay updated on your event progress.</p>
      </div>
      {notifications.map((n) => (
        <div key={n.id} className="notification">
          <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
          <div className="notif-body">
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
          <span className="notif-time">{n.time}</span>
        </div>
      ))}
    </>
  );
}
