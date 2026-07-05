import { API_URL } from './constants';

export function getUploadUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `${API_URL}/uploads/${path.replace(/^\/+/, '')}`;
}

/** Resolve stored media paths and external URLs for display. */
export function resolveMediaUrl(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('data:')
    || trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('//')
  ) {
    return trimmed;
  }
  return getUploadUrl(trimmed);
}

export function isYouTubeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  return /(?:youtube\.com|youtu\.be)/i.test(value);
}

