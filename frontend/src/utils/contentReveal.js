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

export function normalizeContentRevealOrder(order, options = {}) {
  const available = getAvailableRevealSections(options).map((section) => section.id);
  const source = Array.isArray(order) ? order.filter((id) => available.includes(id)) : [];
  const missing = available.filter((id) => !source.includes(id));
  return [...source, ...missing];
}

export function getContentRevealSectionLabel(sectionId) {
  return CONTENT_REVEAL_SECTIONS.find((section) => section.id === sectionId)?.label || sectionId;
}

export function getSequentialRevealStorageKey(event = {}) {
  const identifier = event.slug || event.id || event.invite_code;
  return identifier ? `inv-sequential-reveal-${identifier}` : 'inv-sequential-reveal';
}

export function readSequentialRevealProgress(event = {}) {
  if (typeof window === 'undefined') return { complete: false, revealedCount: 1 };

  try {
    const raw = window.sessionStorage.getItem(getSequentialRevealStorageKey(event));
    if (!raw) return { complete: false, revealedCount: 1 };
    const parsed = JSON.parse(raw);
    return {
      complete: Boolean(parsed.complete),
      revealedCount: Number.isFinite(parsed.revealedCount) ? Math.max(1, parsed.revealedCount) : 1,
    };
  } catch {
    return { complete: false, revealedCount: 1 };
  }
}

export function writeSequentialRevealProgress(event = {}, progress = {}) {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(
      getSequentialRevealStorageKey(event),
      JSON.stringify({
        complete: Boolean(progress.complete),
        revealedCount: Math.max(1, progress.revealedCount || 1),
      }),
    );
  } catch {
    // Ignore storage failures in private browsing.
  }
}
