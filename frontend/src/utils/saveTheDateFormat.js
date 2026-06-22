import { parseEventDate } from './eventDate';

function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return 'TH';
  switch (day % 10) {
    case 1: return 'ST';
    case 2: return 'ND';
    case 3: return 'RD';
    default: return 'TH';
  }
}

export function formatSaveTheDateLine(eventDate) {
  const parsed = parseEventDate(eventDate);
  if (!parsed) return '';

  const day = parsed.getDate();
  const month = parsed.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = parsed.getFullYear();

  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

export function formatSaveTheDateCompact(eventDate) {
  const parsed = parseEventDate(eventDate);
  if (!parsed) return '';

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatStdCoupleName(displayName = '') {
  const trimmed = displayName.trim();
  if (!trimmed) return '';

  return trimmed
    .replace(/\s*&\s*/g, ' + ')
    .replace(/\s+and\s+/gi, ' + ');
}

export function getSaveTheDateLocationLine(invitation = {}) {
  return invitation.std_location?.trim().toUpperCase() || '';
}

export function getSaveTheDatePhoto(invitation = {}) {
  return invitation.std_photo?.trim()
    || invitation.std_cover_image?.trim()
    || invitation.cover_image?.trim()
    || '';
}

const DEFAULT_STD_PHOTO_LAYOUT = {
  buttonTop: '70%',
  objectPosition: 'center 34%',
};

/** Align RSVP button near groom palm level based on photo proportions. */
export function getStdPhotoLayout(naturalWidth, naturalHeight) {
  if (!naturalWidth || !naturalHeight) return DEFAULT_STD_PHOTO_LAYOUT;

  const ratio = naturalHeight / naturalWidth;

  if (ratio >= 1.2) {
    return { buttonTop: '72%', objectPosition: 'center 44%' };
  }
  if (ratio >= 1.0) {
    return { buttonTop: '70%', objectPosition: 'center 40%' };
  }
  if (ratio >= 0.72) {
    return { buttonTop: '66%', objectPosition: 'center 34%' };
  }
  if (ratio >= 0.55) {
    return { buttonTop: '62%', objectPosition: 'center 34%' };
  }
  return { buttonTop: '58%', objectPosition: 'center 30%' };
}

function formatVenueLocationText(venue = {}) {
  const name = venue.name?.trim();
  if (name) return name.toUpperCase();

  const address = venue.address?.trim();
  if (!address) return '';

  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2].toUpperCase();
  return parts[0].toUpperCase();
}

function hasVenueDetails(venue = {}) {
  return Boolean(
    venue.name?.trim()
    || venue.address?.trim()
    || venue.time?.trim()
    || venue.image?.trim()
    || venue.map_url?.trim(),
  );
}

function buildVenueEntry(key, label, venue = {}) {
  if (!hasVenueDetails(venue)) return null;

  const name = venue.name?.trim() || '';
  const text = formatVenueLocationText(venue);

  return {
    key,
    label,
    text,
    name,
    address: venue.address?.trim() || '',
    time: venue.time?.trim() || '',
    image: venue.image?.trim() || '',
    mapUrl: venue.map_url?.trim() || '',
  };
}

export function getSaveTheDateLocations(invitation = {}) {
  if (invitation.std_location?.trim()) {
    return [{
      key: 'custom',
      label: '',
      text: invitation.std_location.trim().toUpperCase(),
      name: '',
      time: '',
      image: '',
      address: '',
      mapUrl: '',
    }];
  }

  const ceremony = invitation?.venue?.ceremony || {};
  const reception = invitation?.venue?.reception || {};
  const entries = [
    buildVenueEntry('ceremony', 'CEREMONY', ceremony),
    buildVenueEntry('reception', 'RECEPTION', reception),
  ].filter(Boolean);

  const showLabels = entries.length > 1;

  return entries.map((entry) => ({
    ...entry,
    label: showLabels ? entry.label : '',
  }));
}

export function getSaveTheDateLocation(invitation = {}) {
  const locations = getSaveTheDateLocations(invitation);
  if (!locations.length) return '';
  if (locations.length === 1) return locations[0].text || locations[0].name;
  return locations.map((location) => {
    const place = location.name || location.text;
    if (location.label && place) return `${location.label}: ${place}`;
    return place || location.label;
  }).join(' · ');
}
