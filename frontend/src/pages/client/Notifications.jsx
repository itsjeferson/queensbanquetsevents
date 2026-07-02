import { useNotifications } from '../../context/NotificationContext';
import NotificationList from '../../components/notifications/NotificationList';

export default function Notifications() {
  const { notifications, loading, isUnread } = useNotifications();

  return (
    <>
      <div className="dash-header">
        <h1>Notifications</h1>
        <p>Stay updated on RSVPs, invitations, and guest activity.</p>
      </div>
      <div className="card-widget">
        <NotificationList
          notifications={notifications}
          loading={loading}
          isUnread={isUnread}
        />
      </div>
    </>
  );
}
