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
