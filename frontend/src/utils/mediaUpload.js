import { mediaService } from '../services/mediaService';
import { ApiError } from '../services/api';
import { isHostedMediaUrl, resolveMediaUrl } from './mediaUrl';

export const MAX_AUDIO_SIZE_MB = 8;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 15;

export function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:');
}

export function getDataUrlSizeMb(value) {
  if (!isDataUrl(value)) return 0;
  const prefix = value.indexOf(',');
  const base64Length = prefix >= 0 ? value.length - prefix - 1 : value.length;
  return (base64Length * 0.75) / (1024 * 1024);
}

export function getMediaFieldDisplay(url) {
  if (!url) return '';
  if (isDataUrl(url)) {
    const mb = getDataUrlSizeMb(url);
    return mb >= 0.1 ? `Uploaded file (${mb.toFixed(1)} MB)` : 'Uploaded file';
  }
  try {
    const pathname = new URL(url, 'http://local').pathname;
    const filename = pathname.split('/').pop();
    if (filename) return filename;
  } catch {
    // fall through
  }
  return 'Uploaded file';
}

export function readFileAsDataUrl(file, maxSizeMb) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      reject(new Error(`File is too large. Please use a file under ${maxSizeMb} MB or paste a direct URL instead.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

function trimMediaString(value, maxLength) {
  if (typeof value !== 'string') return value;
  if (value.length > maxLength) return '';
  return value;
}

/** Recursively remove embedded data URLs so API payloads stay small. */
export function stripEmbeddedMediaForApi(value, maxLength = 50000) {
  if (typeof value === 'string') return trimMediaString(value, maxLength);
  if (Array.isArray(value)) return value.map((item) => stripEmbeddedMediaForApi(item, maxLength));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripEmbeddedMediaForApi(item, maxLength)]),
    );
  }
  return value;
}

export function stripLargeDataUrls(invitation, maxLength = 50000) {
  if (!invitation || typeof invitation !== 'object') return invitation;
  return stripEmbeddedMediaForApi(invitation, maxLength);
}

export function canPersistMediaUrl(value, maxLength) {
  if (typeof value !== 'string' || !value.trim()) return false;
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  if (/^[a-z0-9_\-/]+\.(jpe?g|png|gif|webp|mp4|webm|mp3|wav|ogg|m4a)$/i.test(value.trim())) return true;
  return value.length <= maxLength;
}

export async function importRemoteMediaUrl(url) {
  if (!url || typeof url !== 'string' || isHostedMediaUrl(url)) {
    return url;
  }

  try {
    const response = await mediaService.importRemoteMedia(url.trim());
    return response?.data?.url || url;
  } catch {
    return url;
  }
}

export async function uploadInvitationMediaFile(file, maxSizeMb) {
  if (!file) {
    throw new Error('No file selected');
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File is too large. Please use a file under ${maxSizeMb} MB or paste a direct URL instead.`);
  }

  try {
    const response = await mediaService.uploadInvitationMedia(file);
    const rawUrl = response?.data?.url || response?.data?.path;
    const url = resolveMediaUrl(rawUrl) || rawUrl;
    if (!url) {
      throw new Error('Upload succeeded but no file URL was returned.');
    }
    return url;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        throw new Error('Please log in again to upload files.');
      }
      if (err.status === 404) {
        throw new Error('File upload is not available on the server yet. Redeploy the API, or paste a direct file URL instead.');
      }
      throw new Error(err.message || 'Upload failed.');
    }
    if (err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }
    throw err;
  }
}

/** Venue photos may be larger than other fields but must stay under API limits. */
export const VENUE_IMAGE_SAVE_MAX_CHARS = 1500000;
