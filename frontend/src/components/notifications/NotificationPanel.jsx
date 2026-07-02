import { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationList, { NotificationListFooter } from './NotificationList';

export default function NotificationPanel() {
  const { panelOpen, closePanel, notifications, loading, isUnread } = useNotifications();

  useEffect(() => {
    if (!panelOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePanel();
    };

    document.body.classList.add('notification-panel-open');
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('notification-panel-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen, closePanel]);

  if (!panelOpen) return null;

  return (
    <>
      <button
        type="button"
        className="notification-panel-backdrop"
        aria-label="Close notifications"
        onClick={closePanel}
      />
      <aside className="notification-panel" aria-label="Notifications">
        <header className="notification-panel-header">
          <div>
            <h2>Notifications</h2>
            <p>Stay updated on RSVPs, invitations, and guest activity.</p>
          </div>
          <button
            type="button"
            className="notification-panel-close"
            onClick={closePanel}
            aria-label="Close notifications panel"
          >
            ✕
          </button>
        </header>
        <div className="notification-panel-body">
          <NotificationList
            notifications={notifications}
            loading={loading}
            isUnread={isUnread}
            compact
          />
        </div>
        <NotificationListFooter />
      </aside>
    </>
  );
}
