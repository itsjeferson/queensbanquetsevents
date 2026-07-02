import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Spinner } from '../common/Loader/Loader';
import { formatTimeAgo } from '../../utils/timeAgo';

function NotificationIcon({ type, unread }) {
  if (type === 'rsvp') {
    return (
      <div
        className="notification-item-icon notification-item-icon--rsvp"
        aria-hidden="true"
      >
        🔔
      </div>
    );
  }

  return (
    <div
      className={`notification-item-icon notification-item-icon--message${unread ? '' : ' notification-item-icon--read'}`}
      aria-hidden="true"
    >
      📬
    </div>
  );
}

export default function NotificationList({
  notifications,
  loading,
  isUnread,
  emptyMessage = 'No notifications yet. You will see RSVP responses and guest book messages here.',
  compact = false,
}) {
  if (loading) {
    return (
      <div className="notification-list-loading">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="notification-list-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`notification-list${compact ? ' notification-list--compact' : ''}`}>
      {notifications.map((item) => {
        const unread = isUnread ? isUnread(item) : false;
        return (
          <article
            key={item.id}
            className={`notification notification-item${unread ? ' notification-item--unread' : ''}`}
          >
            <NotificationIcon type={item.type} unread={unread} />
            <div className="notification-item-body">
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <span className="notification-item-time">{formatTimeAgo(item.created_at)}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function NotificationListFooter() {
  const { closePanel } = useNotifications();

  return (
    <div className="notification-panel-footer">
      <Link
        to="/client/notifications"
        className="notification-panel-view-all"
        onClick={closePanel}
      >
        View all notifications
      </Link>
    </div>
  );
}
