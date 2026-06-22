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

function hasVenueLocation(venue = {}) {
  return Boolean(venue.name?.trim() || venue.address?.trim());
}

export function getSaveTheDateLocations(invitation = {}) {
  if (invitation.std_location?.trim()) {
    return [{
      key: 'custom',
      label: '',
      text: invitation.std_location.trim().toUpperCase(),
    }];
  }

  const ceremony = invitation?.venue?.ceremony || {};
  const reception = invitation?.venue?.reception || {};
  const ceremonyText = formatVenueLocationText(ceremony);
  const receptionText = formatVenueLocationText(reception);
  const hasCeremony = hasVenueLocation(ceremony);
  const hasReception = hasVenueLocation(reception);
  const showLabels = hasCeremony && hasReception && ceremonyText !== receptionText;

  const locations = [];

  if (ceremonyText) {
    locations.push({
      key: 'ceremony',
      label: showLabels ? 'CEREMONY' : '',
      text: ceremonyText,
    });
  }

  if (receptionText && (!hasCeremony || receptionText !== ceremonyText)) {
    locations.push({
      key: 'reception',
      label: showLabels ? 'RECEPTION' : '',
      text: receptionText,
    });
  }

  return locations;
}

export function getSaveTheDateLocation(invitation = {}) {
  const locations = getSaveTheDateLocations(invitation);
  if (!locations.length) return '';
  if (locations.length === 1) return locations[0].text;
  return locations.map((location) => {
    if (location.label) return `${location.label}: ${location.text}`;
    return location.text;
  }).join(' · ');
}
