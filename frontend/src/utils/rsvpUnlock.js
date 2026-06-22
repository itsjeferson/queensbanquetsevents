const STORAGE_PREFIX = 'qb_rsvp_unlock_';

function storageKey(slugOrId) {
  return `${STORAGE_PREFIX}${String(slugOrId || '').trim()}`;
}

export function getUnlockKeys(eventOrKey) {
  if (eventOrKey == null || eventOrKey === '') return [];

  if (typeof eventOrKey === 'object') {
    return [...new Set(
      [eventOrKey.slug, eventOrKey.id, eventOrKey.invite_code, eventOrKey.routeIdentifier]
        .filter((value) => value != null && String(value).trim())
        .map((value) => String(value).trim()),
    )];
  }

  return [String(eventOrKey).trim()].filter(Boolean);
}

export function hasRsvpUnlocked(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return false;

  return keys.some((key) => {
    try {
      const raw = localStorage.getItem(storageKey(key));
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed?.unlocked);
    } catch {
      return false;
    }
  });
}

export function getRsvpUnlockRecord(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) return JSON.parse(raw);
    } catch {
      // try next key
    }
  }
  return null;
}

export function setRsvpUnlocked(eventOrKey, { name = '', attendance = 'yes' } = {}) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return;

  const payload = JSON.stringify({
    unlocked: true,
    name,
    attendance,
    at: new Date().toISOString(),
  });

  keys.forEach((key) => {
    try {
      localStorage.setItem(storageKey(key), payload);
    } catch {
      // ignore quota / private mode
    }
  });
}

export function clearRsvpUnlock(eventOrKey) {
  getUnlockKeys(eventOrKey).forEach((key) => {
    try {
      localStorage.removeItem(storageKey(key));
    } catch {
      // ignore
    }
  });
}
