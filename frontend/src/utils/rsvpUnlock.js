const STORAGE_PREFIX = 'qb_rsvp_unlock_';

function storageKey(slugOrId) {
  return `${STORAGE_PREFIX}${String(slugOrId || '').trim()}`;
}

function getUnlockStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
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

function readUnlockRecord(key) {
  const storage = getUnlockStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(storageKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.unlocked ? parsed : null;
  } catch {
    return null;
  }
}

export function hasRsvpUnlocked(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return false;

  return keys.some((key) => Boolean(readUnlockRecord(key)));
}

export function getRsvpUnlockRecord(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  for (const key of keys) {
    const record = readUnlockRecord(key);
    if (record) return record;
  }
  return null;
}

export function setRsvpUnlocked(eventOrKey, { name = '', attendance = 'yes' } = {}) {
  const storage = getUnlockStorage();
  const keys = getUnlockKeys(eventOrKey);
  if (!storage || !keys.length) return;

  const payload = JSON.stringify({
    unlocked: true,
    name,
    attendance,
    at: new Date().toISOString(),
  });

  keys.forEach((key) => {
    try {
      storage.setItem(storageKey(key), payload);
      // Clear legacy per-device unlock so shared links always start at STD for others.
      localStorage.removeItem(storageKey(key));
    } catch {
      // ignore quota / private mode
    }
  });
}

export function clearRsvpUnlock(eventOrKey) {
  const storage = getUnlockStorage();
  getUnlockKeys(eventOrKey).forEach((key) => {
    try {
      storage?.removeItem(storageKey(key));
      localStorage.removeItem(storageKey(key));
    } catch {
      // ignore
    }
  });
}
