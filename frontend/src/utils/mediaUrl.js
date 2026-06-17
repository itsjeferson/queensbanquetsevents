import { API_URL } from './constants';

export function getUploadUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `${API_URL}/uploads/${path.replace(/^\/+/, '')}`;
}
