import {
  demoWeddingInvitation,
  demoDebutInvitation,
  demoBirthdayInvitation,
} from '../data/demoInvitation';
import { stripLargeDataUrls } from './mediaUpload';
import { normalizeEventDate } from './eventDate';
import { normalizeInvitationContent } from './invitationContent';
import { resolveInvitationThemeFields, extractInvitationThemeInput } from './invitationTheme';

export const STORAGE_PREFIX = 'invitation-draft';
export const CLIENT_PREVIEW_KEY = 'client-latest-preview-slug';

const TYPE_DEMOS = {
  wedding: demoWeddingInvitation,
  debut: demoDebutInvitation,
  birthday: demoBirthdayInvitation,
  anniversary: demoWeddingInvitation,
  corporate: demoWeddingInvitation,
};

function pickText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEventDateValue(dateValue, fallback) {
  return normalizeEventDate(dateValue, fallback);
}

function cleanStory(story, invitation = {}) {
  const sections = (story?.sections || []).filter(
    (section) => pickText(section.heading) || pickText(section.content),
  );
  return {
    title: pickText(story?.title),
    image: pickText(story?.image) || pickText(invitation?.story_image),
    invitation_message: pickText(story?.invitation_message) || pickText(invitation?.invitation_message),
    acceptance_message: pickText(story?.acceptance_message) || pickText(invitation?.acceptance_message),
    sections,
  };
}

function cleanGallery(gallery) {
  return (gallery || []).filter((item) => pickText(item?.image));
}

function cleanVenue(venue) {
  const empty = { name: '', address: '', time: '', map_url: '', image: '' };
  return ['ceremony', 'reception'].reduce((result, type) => {
    const item = venue?.[type] || {};
    result[type] = {
      name: pickText(item.name),
      address: pickText(item.address),
      time: pickText(item.time),
      map_url: pickText(item.map_url),
      image: pickText(item.image),
    };
    return result;
  }, { ceremony: { ...empty }, reception: { ...empty } });
}

function hasVenueDetails(venue) {
  return ['ceremony', 'reception'].some((type) => {
    const item = venue?.[type];
    return pickText(item?.name) || pickText(item?.address) || pickText(item?.time);
  });
}

function cleanProfile(profile) {
  if (!profile) return null;
  const cleaned = {
    name: pickText(profile.name),
    photo: pickText(profile.photo),
    parents: pickText(profile.parents),
  };
  return cleaned.name || cleaned.photo || cleaned.parents ? cleaned : null;
}

function hasAttireDetails(attire, dressCode) {
  return Boolean(
    pickText(dressCode)
    || pickText(attire?.female_primary_sponsors)
    || pickText(attire?.male_primary_sponsors)
    || pickText(attire?.ladies)
    || pickText(attire?.gentlemen)
    || pickText(attire?.reminders)
    || pickText(attire?.primary)
    || pickText(attire?.guests),
  );
}

function mergeGuestExperienceFields(apiInvitation = {}, draftInvitation = {}) {
  const merged = { ...apiInvitation };
  const fields = ['save_the_date_enabled', 'std_message', 'std_cover_image', 'std_location', 'content_reveal_mode'];

  fields.forEach((field) => {
    if (field in draftInvitation) {
      merged[field] = draftInvitation[field];
    }
  });

  return merged;
}

function withDraftGuestExperience(payload, draft) {
  if (!payload || !draft?.invitation) return payload;

  return {
    ...payload,
    invitation: mergeGuestExperienceFields(payload.invitation || {}, draft.invitation),
  };
}

export function mergeInvitationPayloadWithDraft(apiPayload, draft) {
  if (!apiPayload) return draft || null;
  if (!draft?.invitation) return apiPayload;

  const draftTheme = extractInvitationThemeInput(draft.invitation);
  const apiTheme = extractInvitationThemeInput(apiPayload.invitation || {});
  const draftMotif = draftTheme.color_motif || 'classic-gold';
  const apiMotif = apiTheme.color_motif || 'classic-gold';

  if (draftMotif === 'classic-gold' && apiMotif !== 'classic-gold') {
    return withDraftGuestExperience(apiPayload, draft);
  }
  if (draftMotif === apiMotif) {
    return withDraftGuestExperience(apiPayload, draft);
  }

  const themeFields = resolveInvitationThemeFields({
    ...(apiPayload.invitation || {}),
    ...draftTheme,
    color_motif: draftMotif,
  });

  return withDraftGuestExperience({
    ...apiPayload,
    invitation: {
      ...(apiPayload.invitation || {}),
      ...themeFields,
    },
  }, draft);
}

export function buildInvitationPreviewData({ event = {}, invitation = {}, guest_messages } = {}) {
  const eventType = event.event_type || 'wedding';
  const template = TYPE_DEMOS[eventType] || demoWeddingInvitation;
  const templateInv = template.invitation;
  const story = cleanStory(invitation.story, invitation);
  const venue = cleanVenue(invitation.venue);
  const gallery = cleanGallery(invitation.gallery);
  const program = (invitation.program || []).filter(
    (item) => pickText(item?.time) || pickText(item?.title),
  );
  const giftPreferences = pickText(invitation.gift_registry?.preferences);
  const paymentDetails = pickText(invitation.gift_registry?.payment_details);
  const groomProfile = cleanProfile(invitation.groom_profile);
  const brideProfile = cleanProfile(invitation.bride_profile);
  const normalized = normalizeInvitationContent({
    ...invitation,
    ...extractInvitationThemeInput(invitation),
    story,
    venue,
    gallery,
    program,
    groom_profile: groomProfile || invitation.groom_profile,
    bride_profile: brideProfile || invitation.bride_profile,
  });
  const themeFields = resolveInvitationThemeFields(normalized);

  return {
    event: {
      ...template.event,
      id: event.id ?? template.event.id,
      event_name: pickText(event.event_name) || 'Your Event',
      event_type: eventType,
      event_date: normalizeEventDateValue(event.event_date, template.event.event_date),
      slug: pickText(event.slug) || template.event.slug,
      invite_code: pickText(event.invite_code) || template.event.invite_code,
      status: event.status || template.event.status || 'draft',
    },
    invitation: {
      ...normalized,
      font_family: pickText(invitation.font_family) || templateInv.font_family,
      qr_enabled: invitation.qr_enabled ?? templateInv.qr_enabled,
      opening_line: pickText(invitation.opening_line) || templateInv.opening_line,
      hero_caption: pickText(invitation.hero_caption) || templateInv.hero_caption,
      couple_display_name: pickText(invitation.couple_display_name),
      couple_initials: pickText(invitation.couple_initials),
      opening_hero_image: pickText(invitation.opening_hero_image),
      secondary_quote: pickText(invitation.secondary_quote),
      quote: pickText(invitation.quote) || templateInv.quote,
      quote_source: pickText(invitation.quote_source) || templateInv.quote_source,
      cover_image: pickText(invitation.cover_image) || templateInv.cover_image,
      background_video: pickText(invitation.background_video),
      music_url: pickText(invitation.music_url),
      dress_code: pickText(invitation.dress_code) || templateInv.dress_code,
      coordinator: pickText(invitation.coordinator) || templateInv.coordinator,
      coordinator_phone: pickText(invitation.coordinator_phone),
      rsvp_note: pickText(invitation.rsvp_note) || templateInv.rsvp_note,
      story,
      groom_profile: groomProfile,
      bride_profile: brideProfile,
      venue: hasVenueDetails(venue) ? venue : normalized.venue,
      gallery: gallery.length ? gallery : templateInv.gallery,
      program: program.length ? program : normalized.program,
      videos: (invitation.videos || []).filter((item) => pickText(item?.url)),
      faqs: (invitation.faqs || []).filter((item) => pickText(item?.question)),
      gift_registry: giftPreferences || paymentDetails
        ? {
          ...templateInv.gift_registry,
          ...invitation.gift_registry,
          preferences: giftPreferences || templateInv.gift_registry?.preferences,
          payment_details: paymentDetails,
        }
        : templateInv.gift_registry,
      attire: hasAttireDetails(invitation.attire, invitation.dress_code)
        ? normalized.attire
        : templateInv.attire,
      save_the_date_enabled: normalized.save_the_date_enabled,
      std_message: pickText(invitation.std_message) || normalized.std_message,
      std_cover_image: pickText(invitation.std_cover_image) || normalized.std_cover_image,
      std_location: pickText(invitation.std_location) || normalized.std_location,
      content_reveal_mode: normalized.content_reveal_mode,
      ...themeFields,
    },
    guest_messages: guest_messages || [],
  };
}

export function getLocalInvitationDraft(identifier) {
  if (typeof window === 'undefined' || !identifier) return null;

  const keys = [
    `${STORAGE_PREFIX}-slug-${identifier}`,
    `${STORAGE_PREFIX}-code-${identifier}`,
    `${STORAGE_PREFIX}-${identifier}`,
  ];

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(key);
    }
  }

  return null;
}

export function saveInvitationDraft({ event, invitation, guest_messages }) {
  if (typeof window === 'undefined' || !event) return;

  const data = { event, invitation, guest_messages: guest_messages || [] };
  let payload = JSON.stringify(data);

  const writeDraft = (draftData) => {
    payload = JSON.stringify(draftData);
    if (event.id != null) {
      localStorage.setItem(`${STORAGE_PREFIX}-${event.id}`, payload);
    }
    if (event.slug) {
      localStorage.setItem(`${STORAGE_PREFIX}-slug-${event.slug}`, payload);
    }
    if (event.invite_code) {
      localStorage.setItem(`${STORAGE_PREFIX}-code-${event.invite_code}`, payload);
    }
  };

  try {
    writeDraft(data);
  } catch {
    try {
      writeDraft({
        ...data,
        invitation: stripLargeDataUrls(data.invitation),
      });
    } catch {
      // Skip local draft if storage quota is exceeded.
    }
  }
}

export function saveClientPreviewSlug(clientId, slug) {
  if (typeof window === 'undefined' || !slug) return;
  localStorage.setItem(CLIENT_PREVIEW_KEY, slug);
  if (clientId != null) {
    localStorage.setItem(`${CLIENT_PREVIEW_KEY}-${clientId}`, slug);
  }
}

export function getClientPreviewSlug(clientId) {
  if (typeof window === 'undefined') return null;
  if (clientId != null) {
    const scoped = localStorage.getItem(`${CLIENT_PREVIEW_KEY}-${clientId}`);
    if (scoped) return scoped;
  }
  return localStorage.getItem(CLIENT_PREVIEW_KEY);
}

export function getPreviewPath(slug, { guestPreview = true, resetRsvp = false } = {}) {
  const params = new URLSearchParams();
  if (guestPreview) params.set('guest', '1');
  if (resetRsvp) params.set('reset', '1');
  const path = `/#/invite/${encodeURIComponent(slug)}`;
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
