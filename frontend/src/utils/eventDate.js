export function normalizeEventDate(dateValue, fallback) {
  if (!dateValue) return fallback;

  const raw = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return `${raw}T16:00:00`;
  }

  if (/^\d{4}-\d{2}-\d{2} /.test(raw)) {
    return raw.replace(' ', 'T');
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
    return `${raw}:00`;
  }

  return raw;
}

export function toDatetimeLocalValue(dateValue) {
  if (!dateValue) return '';

  const normalized = normalizeEventDate(dateValue, '');
  if (!normalized) return '';

  return normalized.slice(0, 16);
}

export function normalizeEventDateForApi(dateValue) {
  if (!dateValue) return dateValue;
  return normalizeEventDate(dateValue, dateValue);
}

export function parseEventDate(dateValue) {
  if (!dateValue) return null;
  const parsed = new Date(normalizeEventDate(dateValue, dateValue));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
