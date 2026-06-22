export const CONTENT_REVEAL_SECTIONS = [
  { id: 'hero', label: 'Opening Hero' },
  { id: 'quote_primary', label: 'Primary Quote' },
  { id: 'story_intro', label: 'Our Story' },
  { id: 'quote_secondary', label: 'Secondary Quote' },
  { id: 'couple_initials', label: 'Couple Initials' },
  { id: 'invitation_message', label: 'Invitation Message' },
  { id: 'couple_showcase', label: 'Couple Showcase' },
  { id: 'wedding_details', label: 'Wedding Details' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'attire', label: 'Attire Guide' },
  { id: 'program', label: 'Program / Timeline' },
  { id: 'gift_registry', label: 'Gift Registry' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'guest_book', label: 'Guest Book' },
  { id: 'qr_share', label: 'QR / Share' },
  { id: 'footer', label: 'Footer' },
];

export const DEFAULT_CONTENT_REVEAL_ORDER = CONTENT_REVEAL_SECTIONS.map((section) => section.id);

export function getAvailableRevealSections({ hideRsvp = false } = {}) {
  if (!hideRsvp) return CONTENT_REVEAL_SECTIONS;
  return CONTENT_REVEAL_SECTIONS.filter((section) => section.id !== 'rsvp');
}

export function getDefaultContentRevealOrder(options = {}) {
  return getAvailableRevealSections(options).map((section) => section.id);
}

/** Visible sections in saved order. Empty order means all sections are shown. */
export function getVisibleContentRevealOrder(order, options = {}) {
  const available = getAvailableRevealSections(options).map((section) => section.id);
  const source = Array.isArray(order) ? order.filter((id) => available.includes(id)) : [];
  if (!source.length) return available;
  return source;
}

/** @deprecated Use getVisibleContentRevealOrder or getDefaultContentRevealOrder */
export function normalizeContentRevealOrder(order, options = {}) {
  return getVisibleContentRevealOrder(order, options);
}

export function buildContentRevealEditorRows(order, options = {}) {
  const available = getAvailableRevealSections(options);
  const visibleOrder = getVisibleContentRevealOrder(order, options);
  const visibleSet = new Set(visibleOrder);

  const visibleRows = visibleOrder.map((id, index) => ({
    id,
    visible: true,
    shownFirst: index === 0,
  }));

  const hiddenRows = available
    .filter((section) => !visibleSet.has(section.id))
    .map((section) => ({
      id: section.id,
      visible: false,
      shownFirst: false,
    }));

  return [...visibleRows, ...hiddenRows];
}

export function setContentRevealVisibility(order, sectionId, visible, options = {}) {
  const available = getAvailableRevealSections(options).map((section) => section.id);
  if (!available.includes(sectionId)) return getVisibleContentRevealOrder(order, options);

  const current = getVisibleContentRevealOrder(order, options);
  if (visible) {
    if (current.includes(sectionId)) return current;
    return [...current, sectionId];
  }
  return current.filter((id) => id !== sectionId);
}

export function moveContentRevealSection(order, sectionId, direction, options = {}) {
  const current = getVisibleContentRevealOrder(order, options);
  const index = current.indexOf(sectionId);
  if (index < 0) return current;

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= current.length) return current;

  const updated = [...current];
  const [item] = updated.splice(index, 1);
  updated.splice(nextIndex, 0, item);
  return updated;
}

export function resolveInvitationSectionOrder(invitation = {}, options = {}) {
  const gradual = invitation.content_reveal_mode === 'gradual';
  if (gradual) {
    return getVisibleContentRevealOrder(invitation.content_reveal_order, options);
  }
  return getDefaultContentRevealOrder(options);
}

export function getContentRevealSectionLabel(sectionId) {
  return CONTENT_REVEAL_SECTIONS.find((section) => section.id === sectionId)?.label || sectionId;
}
