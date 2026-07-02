import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { parseNotificationDate } from '../utils/timeAgo';

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 5000;
const storageKey = (clientId) => `qb_notifications_seen_${clientId}`;

function readLastSeen(clientId) {
  if (!clientId) return null;
  try {
    return localStorage.getItem(storageKey(clientId));
  } catch {
    return null;
  }
}

function writeLastSeen(clientId, iso) {
  if (!clientId) return;
  try {
    localStorage.setItem(storageKey(clientId), iso);
  } catch {
    // ignore storage failures
  }
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const clientId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(() => readLastSeen(clientId));

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!clientId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      const res = await notificationService.getByClient(clientId);
      const list = res.data?.notifications ?? [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      if (!silent) setNotifications([]);
      console.error('Failed to load notifications', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    setLastSeenAt(readLastSeen(clientId));
  }, [clientId]);

  useEffect(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!clientId) return undefined;

    const intervalId = window.setInterval(() => {
      fetchNotifications(true);
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [clientId, fetchNotifications]);

  const markAllRead = useCallback(() => {
    if (!clientId) return;

    const latestTime = notifications.reduce((max, item) => {
      const time = parseNotificationDate(item.created_at).getTime();
      return time > max ? time : max;
    }, 0);

    const seenAt = latestTime > 0
      ? new Date(latestTime).toISOString()
      : new Date().toISOString();

    setLastSeenAt(seenAt);
    writeLastSeen(clientId, seenAt);
  }, [clientId, notifications]);

  useEffect(() => {
    if (location.pathname === '/client/notifications') {
      markAllRead();
    }
  }, [location.pathname, markAllRead]);

  const unreadCount = useMemo(() => {
    if (!notifications.length) return 0;
    if (!lastSeenAt) return notifications.length;

    const seenTime = parseNotificationDate(lastSeenAt).getTime();
    return notifications.filter(
      (item) => parseNotificationDate(item.created_at).getTime() > seenTime,
    ).length;
  }, [notifications, lastSeenAt]);

  const isUnread = useCallback((item) => {
    if (!lastSeenAt) return true;
    return parseNotificationDate(item.created_at).getTime() > parseNotificationDate(lastSeenAt).getTime();
  }, [lastSeenAt]);

  const openPanel = useCallback(() => {
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    markAllRead();
  }, [markAllRead]);

  const value = useMemo(() => ({
    notifications,
    loading,
    unreadCount,
    panelOpen,
    openPanel,
    closePanel,
    markAllRead,
    isUnread,
    refresh: () => fetchNotifications(true),
  }), [
    notifications,
    loading,
    unreadCount,
    panelOpen,
    openPanel,
    closePanel,
    markAllRead,
    isUnread,
    fetchNotifications,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
