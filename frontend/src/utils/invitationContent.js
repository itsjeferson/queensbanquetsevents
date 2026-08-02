import { resolveInvitationThemeFields, extractInvitationThemeInput } from './invitationTheme';
import { stripLargeDataUrls, canPersistMediaUrl, VENUE_IMAGE_SAVE_MAX_CHARS } from './mediaUpload';
import { resolveMediaUrl } from './mediaUrl';
import {
  defaultWeddingProgram as defaultWeddingProgramFromTimeline,
  normalizeWeddingProgram,
} from './weddingTimeline';

export { normalizeWeddingProgram };
export const defaultWeddingProgram = defaultWeddingProgramFromTimeline;

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
  dress_code: 'Formal Filipino',
  gentlemen_pants: {
    groom: 'Dark Brown',
    ninongs: 'Light Brown',
    groomsmen: 'Black',
    other_gentlemen: 'Black',
  },
  ladies_gowns: {
    mothers: 'Beacon Blue',
    ninangs: 'Mid-Blue',
    bridesmaids: 'Pale Blue or Lime Cream',
    secondary_sponsors: 'Titanite Green',
    other_ladies: 'Light Beige, Warm Taupe, Sage Green, or Espresso',
  },
  reminders: 'To honor our wedding party and family, we have assigned specific colors for each group.',
  color_guide_note: 'To honor our wedding party and family, we have assigned specific colors for each group.',
});

export const defaultColorGuide = () => [
  { name: 'NAVY / DEEP BEACON', color: '#091333' },
  { name: 'MID-BLUE', color: '#6184a8' },
  { name: 'PALE BLUE', color: '#b5d4e8' },
  { name: 'TITANITE GREEN', color: '#739527' },
  { name: 'LIME CREAM', color: '#b6e18c' },
  { name: 'SOFT CREAM', color: '#fef4c9' },
  { name: 'SAGE GREEN', color: '#a2c983' },
  { name: 'LIGHT BEIGE', color: '#e6dfc9' },
  { name: 'WARM TAUPE', color: '#d7a26c' },
  { name: 'ESPRESSO', color: '#6f6356' },
];

export const defaultWeddingInvitationContent = {
  opening_line: 'With great joy, we invite you',
  hero_caption: 'In the union of',
  couple_display_name: '',
  opening_hero_image: '',
  hide_hero_text_overlay: false,
  couple_initials: '',
  couple_logo: '',
  quote: 'So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.',
  quote_source: '',
  secondary_quote: '',
  cover_image: '',
  background_video: '',
  music_url: '',
  hide_music_player: false,
  countdown_title: 'Countdown to forever:',
  countdown_bg_media: '',
  std_music_url: '',
  dress_code: 'Formal Filipino',
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
  color_guide: defaultColorGuide(),
  color_guide_image: '',
  faqs: [],
  entourage: defaultEntourage(),
  qr_enabled: 1,
  hide_qr_share: false,
  hide_share_button: false,
  hide_rsvp_button: false,
  hide_rsvp: false,
  hide_footer: false,
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
  password_protected: false,
  password: '',
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

  const restoreField = (field, maxLength = 50000) => {
    const value = invitation[field];
    if (canPersistMediaUrl(value, maxLength)) {
      stripped[field] = value;
    }
  };

  ['cover_image', 'opening_hero_image', 'background_video', 'music_url', 'couple_logo', 'countdown_bg_media', 'std_music_url'].forEach((field) => {
    restoreField(field);
  });

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

  const storyImage = invitation.story?.image || invitation.story_image;
  if (canPersistMediaUrl(storyImage, VENUE_IMAGE_SAVE_MAX_CHARS)) {
    stripped.story = { ...(stripped.story || {}), image: storyImage };
    stripped.story_image = storyImage;
  }

  if (canPersistMediaUrl(invitation.groom_profile?.photo, VENUE_IMAGE_SAVE_MAX_CHARS)) {
    stripped.groom_profile = {
      ...(stripped.groom_profile || {}),
      ...(invitation.groom_profile || {}),
      photo: invitation.groom_profile.photo,
    };
  }

  if (canPersistMediaUrl(invitation.bride_profile?.photo, VENUE_IMAGE_SAVE_MAX_CHARS)) {
    stripped.bride_profile = {
      ...(stripped.bride_profile || {}),
      ...(invitation.bride_profile || {}),
      photo: invitation.bride_profile.photo,
    };
  }

  const sourceGallery = Array.isArray(invitation.gallery) ? invitation.gallery : [];
  stripped.gallery = sourceGallery.map((item, index) => {
    const image = item?.image;
    const fallback = stripped.gallery?.[index]?.image || '';
    return {
      ...(stripped.gallery?.[index] || {}),
      ...item,
      image: canPersistMediaUrl(image, VENUE_IMAGE_SAVE_MAX_CHARS) ? image : fallback,
    };
  });

  stripped.program = normalizeWeddingProgram(invitation.program);

  return {
    ...stripped,
    template_id: (invitation?.template_id && Number(invitation.template_id) !== 3) ? Number(invitation.template_id) : 1,
    entourage: cleanEntourageLists(stripped.entourage),
  };
}

export function normalizeInvitationContent(invitation = {}) {
  const story = invitation.story || {};
  const venue = invitation.venue || {};
  const themeInput = extractInvitationThemeInput(invitation);
  const resolveMedia = (value) => resolveMediaUrl(value) || '';

  const rawRegistry = invitation.gift_registry;
  const giftRegistryObj = (rawRegistry && typeof rawRegistry === 'object' && !Array.isArray(rawRegistry))
    ? rawRegistry
    : {};

  const gift_registry = {
    ...defaultWeddingInvitationContent.gift_registry,
    ...giftRegistryObj,
    preferences: giftRegistryObj.preferences ?? giftRegistryObj.note ?? (typeof rawRegistry === 'string' ? rawRegistry : defaultWeddingInvitationContent.gift_registry.preferences),
    payment_details: giftRegistryObj.payment_details ?? invitation.payment_details ?? '',
  };

  return {
    ...defaultWeddingInvitationContent,
    ...invitation,
    template_id: (invitation?.template_id && Number(invitation.template_id) !== 3) ? Number(invitation.template_id) : 1,
    couple_display_name: invitation.couple_display_name || '',
    opening_hero_image: resolveMedia(invitation.opening_hero_image),
    hide_hero_text_overlay: Boolean(invitation.hide_hero_text_overlay),
    couple_initials: invitation.couple_initials || '',
    couple_logo: resolveMedia(invitation.couple_logo),
    secondary_quote: invitation.secondary_quote || '',
    cover_image: resolveMedia(invitation.cover_image),
    background_video: resolveMedia(invitation.background_video),
    music_url: resolveMedia(invitation.music_url),
    hide_music_player: Boolean(invitation.hide_music_player ?? story.hide_music_player),
    std_music_url: resolveMedia(invitation.std_music_url),
    countdown_title: invitation.countdown_title || 'Countdown to forever:',
    countdown_bg_media: resolveMedia(invitation.countdown_bg_media || invitation.countdown_media),
    groom_profile: {
      ...defaultGroomProfile(),
      ...(invitation.groom_profile || {}),
      photo: resolveMedia(invitation.groom_profile?.photo),
    },
    bride_profile: {
      ...defaultBrideProfile(),
      ...(invitation.bride_profile || {}),
      photo: resolveMedia(invitation.bride_profile?.photo),
    },
    story: {
      ...defaultWeddingInvitationContent.story,
      ...story,
      image: resolveMedia(story.image || invitation.story_image),
      invitation_message: story.invitation_message || invitation.invitation_message || '',
      acceptance_message: story.acceptance_message || invitation.acceptance_message || '',
    },
    venue: {
      ceremony: {
        ...defaultVenueLocation(),
        ...(venue.ceremony || {}),
        image: resolveMedia(venue.ceremony?.image),
      },
      reception: {
        ...defaultVenueLocation(),
        ...(venue.reception || {}),
        image: resolveMedia(venue.reception?.image),
      },
    },
    gift_registry,
    attire: {
      ...defaultAttire(),
      ...(invitation.attire || {}),
      gentlemen_pants: {
        ...defaultAttire().gentlemen_pants,
        ...(invitation.attire?.gentlemen_pants || {}),
      },
      ladies_gowns: {
        ...defaultAttire().ladies_gowns,
        ...(invitation.attire?.ladies_gowns || {}),
      },
    },
    color_guide: Array.isArray(invitation.color_guide) && invitation.color_guide.length > 0
      ? invitation.color_guide
      : defaultColorGuide(),
    color_guide_image: resolveMedia(invitation.color_guide_image),
    entourage: mergeEntourage(invitation.entourage),
    program: normalizeWeddingProgram(invitation.program),
    gallery: (Array.isArray(invitation.gallery) ? invitation.gallery : []).map((item) => ({
      ...item,
      image: resolveMedia(item?.image),
    })),
    faqs: Array.isArray(invitation.faqs) ? invitation.faqs : [],
    save_the_date_enabled: isSaveTheDateActive(invitation),
    std_message: invitation.std_message || '',
    std_cover_image: resolveMedia(invitation.std_cover_image),
    std_photo: resolveMedia(invitation.std_photo || invitation.std_cover_image),
    std_location: invitation.std_location || '',
    content_reveal_mode: (invitation.content_reveal_mode ?? invitation.story?.content_reveal_mode) === 'gradual'
      ? 'gradual'
      : 'full',
    content_reveal_order: Array.isArray(invitation.content_reveal_order)
      ? invitation.content_reveal_order
      : [],
    floral_design_enabled: invitation.floral_design_enabled !== false,
    hide_qr_share: Boolean(invitation.hide_qr_share || invitation.qr_enabled === false || invitation.qr_enabled === 0 || invitation.qr_enabled === '0'),
    hide_share_button: Boolean(invitation.hide_share_button),
    hide_rsvp_button: Boolean(invitation.hide_rsvp_button),
    hide_rsvp: Boolean(invitation.hide_rsvp),
    hide_footer: Boolean(invitation.hide_footer),
    ...resolveInvitationThemeFields(themeInput),
    password_protected: isPasswordProtected(invitation),
    password: invitation.password || '',
  };
}

/** True when QR / Scan to View share section is enabled. */
export function isQrShareEnabled(invitation = {}) {
  if (invitation.hide_qr_share === true || invitation.hide_qr_share === 1 || invitation.hide_qr_share === '1' || invitation.hide_qr_share === 'true') {
    return false;
  }
  if (invitation.qr_enabled === false || invitation.qr_enabled === 0 || invitation.qr_enabled === '0' || invitation.qr_enabled === 'false') {
    return false;
  }
  return true;
}

/** True when password protection is explicitly enabled. */
export function isPasswordProtected(invitation = {}, event = {}) {
  const val = invitation?.password_protected ?? event?.password_protected;
  if (val === true || val === 1 || val === '1' || val === 'true') return true;
  return false;
}

/** True when corner floral ornaments should appear on invitation sections. */
export function isFloralDesignEnabled(invitation = {}) {
  return invitation.floral_design_enabled !== false;
}

/** True only when the client explicitly enabled Save the Date first. */
export function isSaveTheDateActive(invitation = {}) {
  const val = invitation.save_the_date_enabled;
  if (val === true || val === 1 || val === '1' || val === 'true') return true;
  return false;
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
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return 'RJ';
}
