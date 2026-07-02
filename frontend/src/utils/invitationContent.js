import { resolveInvitationThemeFields, extractInvitationThemeInput } from './invitationTheme';
import { stripLargeDataUrls, canPersistMediaUrl, VENUE_IMAGE_SAVE_MAX_CHARS } from './mediaUpload';

export const defaultGroomProfile = () => ({
  name: '',
  photo: '',
  parents: '',
});

export const defaultBrideProfile = () => ({
  name: '',
  photo: '',
  parents: '',
});

export const defaultVenueLocation = () => ({
  name: '',
  address: '',
  time: '',
  map_url: '',
  image: '',
});

export const defaultEntourage = () => ({
  groom: { name: '', parents: [] },
  bride: { name: '', parents: [] },
  principal_sponsors: { male: [], female: [] },
  secondary_sponsors: { candle: [], veil: [], cord: [] },
  best_men: [],
  maid_of_honor: [],
  groomsmen: [],
  bridesmaids: [],
  bible_bearer: [],
  ring_bearer: [],
  coin_bearer: [],
  flower_girls: [],
});

export const defaultAttire = () => ({
  female_primary_sponsors: '',
  male_primary_sponsors: '',
  ladies: '',
  gentlemen: '',
  female_primary_sponsors_colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  male_primary_sponsors_colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  ladies_colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  gentlemen_colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  reminders: '',
});

export const defaultWeddingProgram = () => [
  { time: '3:00 PM', title: 'Wedding Ceremony' },
  { time: '4:00 PM', title: 'Pictorial' },
  { time: '4:30 PM', title: 'Cocktail Hour' },
  { time: '5:00 PM', title: 'Band First Set' },
  { time: '6:00 PM', title: 'Program Proper' },
  { time: '7:00 PM', title: 'Dinner' },
  { time: '8:30 PM', title: 'Same Day Edit Photo and Video' },
];

export const defaultWeddingInvitationContent = {
  opening_line: 'With great joy, we invite you',
  hero_caption: 'In the union of',
  couple_display_name: '',
  opening_hero_image: '',
  couple_initials: '',
  quote: 'So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.',
  quote_source: '',
  secondary_quote: '',
  cover_image: '',
  background_video: '',
  music_url: '',
  dress_code: 'Formal / Black Tie Optional',
  rsvp_note: 'You are special to us. Kindly confirm your attendance below.',
  coordinator: '',
  story: {
    title: 'I have finally found you',
    image: '',
    invitation_message:
      'Together with our beloved parents, we warmly invite you to join us on the special day of our union in marriage.',
    acceptance_message:
      'May you kindly accept our invitation to join and celebrate with us in this once-in-a-lifetime occasion of our lives.',
    sections: [{ heading: '', content: '' }],
  },
  groom_profile: defaultGroomProfile(),
  bride_profile: defaultBrideProfile(),
  venue: {
    ceremony: defaultVenueLocation(),
    reception: defaultVenueLocation(),
  },
  program: defaultWeddingProgram(),
  gallery: [],
  videos: [],
  gift_registry: {
    preferences:
      'Your presence and prayers are all that we request, but if you desire to give nonetheless, a monetary gift is appreciated.',
    payment_details: '',
  },
  attire: defaultAttire(),
  faqs: [],
  entourage: defaultEntourage(),
  qr_enabled: 1,
  color_motif: 'classic-gold',
  primary_color: '#B47B36',
  secondary_color: '#F4EEE7',
  background_color: '#FFFAF5',
  palette_colors: [],
  save_the_date_enabled: false,
  std_message: '',
  std_cover_image: '',
  std_photo: '',
  std_location: '',
  content_reveal_mode: 'full',
  content_reveal_order: [],
  floral_design_enabled: true,
};

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function normalizeParents(value) {
  if (Array.isArray(value)) return asList(value);
  if (typeof value === 'string' && value.trim()) {
    return value.split(/\s*&\s*/).map((part) => part.trim()).filter(Boolean);
  }
  return [];
}

function mergeEntourage(entourage) {
  const base = defaultEntourage();
  if (!entourage || typeof entourage !== 'object') return base;

  if (Array.isArray(entourage.principal_sponsors)) {
    base.principal_sponsors.male = entourage.principal_sponsors;
  } else if (entourage.principal_sponsors) {
    base.principal_sponsors = {
      male: asList(entourage.principal_sponsors.male),
      female: asList(entourage.principal_sponsors.female),
    };
  }

  if (Array.isArray(entourage.secondary_sponsors)) {
    base.secondary_sponsors.cord = entourage.secondary_sponsors;
  } else if (entourage.secondary_sponsors) {
    base.secondary_sponsors = {
      candle: asList(entourage.secondary_sponsors.candle),
      veil: asList(entourage.secondary_sponsors.veil),
      cord: asList(entourage.secondary_sponsors.cord),
    };
  }

  return {
    ...base,
    ...entourage,
    groom: {
      ...base.groom,
      ...(entourage.groom || {}),
      name: entourage.groom?.name || '',
      parents: normalizeParents(entourage.groom?.parents),
    },
    bride: {
      ...base.bride,
      ...(entourage.bride || {}),
      name: entourage.bride?.name || '',
      parents: normalizeParents(entourage.bride?.parents),
    },
    principal_sponsors: {
      ...base.principal_sponsors,
      ...(entourage.principal_sponsors && !Array.isArray(entourage.principal_sponsors)
        ? entourage.principal_sponsors
        : {}),
    },
    secondary_sponsors: {
      ...base.secondary_sponsors,
      ...(entourage.secondary_sponsors && !Array.isArray(entourage.secondary_sponsors)
        ? entourage.secondary_sponsors
        : {}),
    },
    best_men: asList(entourage.best_men?.length ? entourage.best_men : entourage.best_man),
    maid_of_honor: asList(entourage.maid_of_honor),
    groomsmen: asList(entourage.groomsmen),
    bridesmaids: asList(entourage.bridesmaids),
    bible_bearer: asList(entourage.bible_bearer),
    ring_bearer: asList(entourage.ring_bearer),
    coin_bearer: asList(entourage.coin_bearer),
    flower_girls: asList(entourage.flower_girls),
  };
}

function cleanEntourageLists(entourage) {
  if (!entourage || typeof entourage !== 'object') return entourage;

  const listKeys = [
    'best_men',
    'maid_of_honor',
    'groomsmen',
    'bridesmaids',
    'bible_bearer',
    'ring_bearer',
    'coin_bearer',
    'flower_girls',
  ];
  const cleaned = { ...entourage };

  listKeys.forEach((key) => {
    if (key in cleaned) cleaned[key] = asList(cleaned[key]);
  });

  if (cleaned.groom) {
    cleaned.groom = { ...cleaned.groom, parents: asList(cleaned.groom.parents) };
  }
  if (cleaned.bride) {
    cleaned.bride = { ...cleaned.bride, parents: asList(cleaned.bride.parents) };
  }
  if (cleaned.principal_sponsors && !Array.isArray(cleaned.principal_sponsors)) {
    cleaned.principal_sponsors = {
      male: asList(cleaned.principal_sponsors.male),
      female: asList(cleaned.principal_sponsors.female),
    };
  }
  if (cleaned.secondary_sponsors && !Array.isArray(cleaned.secondary_sponsors)) {
    cleaned.secondary_sponsors = {
      candle: asList(cleaned.secondary_sponsors.candle),
      veil: asList(cleaned.secondary_sponsors.veil),
      cord: asList(cleaned.secondary_sponsors.cord),
    };
  }

  return cleaned;
}

/** Strip embedded media blobs so text updates (entourage, etc.) can sync to the API. */
export function prepareInvitationForApiSave(invitation) {
  if (!invitation) return invitation;
  const sourceVenue = invitation.venue || {};
  const stripped = stripLargeDataUrls(invitation);

  stripped.venue = {
    ceremony: { ...(stripped.venue?.ceremony || {}) },
    reception: { ...(stripped.venue?.reception || {}) },
  };

  ['ceremony', 'reception'].forEach((type) => {
    const image = sourceVenue[type]?.image;
    if (!canPersistMediaUrl(image, VENUE_IMAGE_SAVE_MAX_CHARS)) return;
    stripped.venue[type] = {
      ...stripped.venue[type],
      image,
    };
  });

  const stdPhoto = invitation.std_photo || invitation.std_cover_image;
  if (canPersistMediaUrl(stdPhoto, VENUE_IMAGE_SAVE_MAX_CHARS)) {
    stripped.std_photo = stdPhoto;
    stripped.std_cover_image = stdPhoto;
  }

  return {
    ...stripped,
    entourage: cleanEntourageLists(stripped.entourage),
  };
}

export function normalizeInvitationContent(invitation = {}) {
  const story = invitation.story || {};
  const venue = invitation.venue || {};
  const themeInput = extractInvitationThemeInput(invitation);

  return {
    ...defaultWeddingInvitationContent,
    ...invitation,
    couple_display_name: invitation.couple_display_name || '',
    opening_hero_image: invitation.opening_hero_image || '',
    couple_initials: invitation.couple_initials || '',
    secondary_quote: invitation.secondary_quote || '',
    groom_profile: { ...defaultGroomProfile(), ...(invitation.groom_profile || story.groom_profile || {}) },
    bride_profile: { ...defaultBrideProfile(), ...(invitation.bride_profile || story.bride_profile || {}) },
    story: {
      ...defaultWeddingInvitationContent.story,
      ...story,
      image: story.image || invitation.story_image || '',
      invitation_message: story.invitation_message || invitation.invitation_message || '',
      acceptance_message: story.acceptance_message || invitation.acceptance_message || '',
    },
    venue: {
      ceremony: { ...defaultVenueLocation(), ...(venue.ceremony || {}) },
      reception: { ...defaultVenueLocation(), ...(venue.reception || {}) },
    },
    attire: { ...defaultAttire(), ...(invitation.attire || {}) },
    entourage: mergeEntourage(invitation.entourage),
    program: invitation.program?.length ? invitation.program : defaultWeddingProgram(),
    gallery: Array.isArray(invitation.gallery) ? invitation.gallery : [],
    faqs: Array.isArray(invitation.faqs) ? invitation.faqs : [],
    save_the_date_enabled: Boolean(invitation.save_the_date_enabled),
    std_message: invitation.std_message || '',
    std_cover_image: invitation.std_cover_image || '',
    std_photo: invitation.std_photo || invitation.std_cover_image || '',
    std_location: invitation.std_location || '',
    content_reveal_mode: (invitation.content_reveal_mode ?? invitation.story?.content_reveal_mode) === 'gradual'
      ? 'gradual'
      : 'full',
    content_reveal_order: Array.isArray(invitation.content_reveal_order)
      ? invitation.content_reveal_order
      : [],
    floral_design_enabled: invitation.floral_design_enabled !== false,
    ...resolveInvitationThemeFields(themeInput),
  };
}

/** True when corner floral ornaments should appear on invitation sections. */
export function isFloralDesignEnabled(invitation = {}) {
  return invitation.floral_design_enabled !== false;
}

/** True only when the client explicitly enabled Save the Date first. */
export function isSaveTheDateActive(invitation = {}) {
  return Boolean(invitation.save_the_date_enabled);
}

export function getCoupleDisplayName(event, invitation) {
  return invitation.couple_display_name?.trim() || event?.event_name?.trim() || 'Our Wedding';
}

export function splitCoupleDisplayName(name = '') {
  return name
    .trim()
    .split(/\s*&\s*|\s+and\s+|\s+\+\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getCoupleInitials(event, invitation) {
  if (invitation.couple_initials?.trim()) return invitation.couple_initials.trim();
  const parts = splitCoupleDisplayName(getCoupleDisplayName(event, invitation));
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}&${parts[1][0] || ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
