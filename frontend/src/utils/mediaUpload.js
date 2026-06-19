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
  return url;
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

export function stripLargeDataUrls(invitation, maxLength = 50000) {
  if (!invitation || typeof invitation !== 'object') return invitation;

  const trim = (value) => (typeof value === 'string' && value.length > maxLength ? '' : value);

  return {
    ...invitation,
    cover_image: trim(invitation.cover_image),
    background_video: trim(invitation.background_video),
    music_url: trim(invitation.music_url),
    gallery: (invitation.gallery || []).map((item) => ({
      ...item,
      image: trim(item?.image),
    })),
  };
}
