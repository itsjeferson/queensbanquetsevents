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
  groom: { name: '', parents: '' },
  bride: { name: '', parents: '' },
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
  ladies_colors: ['#F4EEE7', '#D4AF37', '#C27691', '#8B4513'],
  gentlemen_colors: ['#F4EEE7', '#D4AF37', '#C27691', '#8B4513'],
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
};

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
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
    groom: { ...base.groom, ...(entourage.groom || {}) },
    bride: { ...base.bride, ...(entourage.bride || {}) },
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

export function normalizeInvitationContent(invitation = {}) {
  const story = invitation.story || {};
  const venue = invitation.venue || {};

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
  };
}

export function getCoupleDisplayName(event, invitation) {
  return invitation.couple_display_name?.trim() || event?.event_name?.trim() || 'Our Wedding';
}

export function getCoupleInitials(event, invitation) {
  if (invitation.couple_initials?.trim()) return invitation.couple_initials.trim();
  const name = getCoupleDisplayName(event, invitation);
  const parts = name.split(/\s*&\s*|\s+and\s+/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}&${parts[1][0] || ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
