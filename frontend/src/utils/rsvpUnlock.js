const STORAGE_PREFIX = 'qb_rsvp_unlock_';
const PREVIEW_RESET_PREFIX = 'qb_rsvp_preview_reset_';

function storageKey(slugOrId) {
  return `${STORAGE_PREFIX}${String(slugOrId || '').trim()}`;
}

function getSessionStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

function getPersistentStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
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

function parseUnlockRecord(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.unlocked ? parsed : null;
  } catch {
    return null;
  }
}

function mergeUnlockRecord(key, patch) {
  const current = readUnlockRecord(key) || {};
  writeUnlockRecord(key, {
    unlocked: true,
    opened: false,
    name: '',
    attendance: 'yes',
    at: new Date().toISOString(),
    ...current,
    ...patch,
  });
}

/** Guest RSVP unlock is stored in localStorage so refresh keeps them on the invitation. */
function readUnlockRecord(key) {
  const storages = [getPersistentStorage(), getSessionStorage()].filter(Boolean);

  for (const storage of storages) {
    try {
      const record = parseUnlockRecord(storage.getItem(storageKey(key)));
      if (record) return record;
    } catch {
      // ignore
    }
  }

  return null;
}

function writeUnlockRecord(key, payload) {
  const json = JSON.stringify(payload);
  const storages = [getPersistentStorage(), getSessionStorage()].filter(Boolean);

  storages.forEach((storage) => {
    try {
      storage.setItem(storageKey(key), json);
    } catch {
      // ignore quota / private mode
    }
  });
}

export function hasRsvpUnlocked(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return false;

  return keys.some((key) => Boolean(readUnlockRecord(key)));
}

export function hasInvitationOpened(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return false;

  return keys.some((key) => Boolean(readUnlockRecord(key)?.opened));
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
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return;

  keys.forEach((key) => mergeUnlockRecord(key, {
    unlocked: true,
    opened: false,
    name,
    attendance,
    at: new Date().toISOString(),
  }));
}

export function setInvitationOpened(eventOrKey) {
  const keys = getUnlockKeys(eventOrKey);
  if (!keys.length) return;

  keys.forEach((key) => mergeUnlockRecord(key, {
    unlocked: true,
    opened: true,
    openedAt: new Date().toISOString(),
  }));
}

export function clearRsvpUnlock(eventOrKey) {
  const storages = [getPersistentStorage(), getSessionStorage()].filter(Boolean);

  getUnlockKeys(eventOrKey).forEach((key) => {
    const itemKey = storageKey(key);
    storages.forEach((storage) => {
      try {
        storage.removeItem(itemKey);
      } catch {
        // ignore
      }
    });
  });
}

/** One-shot flag so owner preview tabs reopen at Save the Date without a URL param. */
export function armRsvpPreviewReset(eventOrKey) {
  const storage = getSessionStorage();
  if (!storage) return;

  getUnlockKeys(eventOrKey).forEach((key) => {
    try {
      storage.setItem(`${PREVIEW_RESET_PREFIX}${key}`, '1');
    } catch {
      // ignore
    }
  });
}

export function consumeRsvpPreviewReset(eventOrKey) {
  const storage = getSessionStorage();
  if (!storage) return false;

  let consumed = false;
  getUnlockKeys(eventOrKey).forEach((key) => {
    const flagKey = `${PREVIEW_RESET_PREFIX}${key}`;
    if (storage.getItem(flagKey) !== '1') return;
    storage.removeItem(flagKey);
    consumed = true;
  });

  return consumed;
}
