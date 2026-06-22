import { getCoupleDisplayName } from './invitationContent';

const DEFAULT_TITLE = "Queen's Banquet Events";

function upsertMeta(attrName, attrValue, content) {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function pickDescription(event, invitation, coupleName) {
  return (
    invitation?.opening_line?.trim()
    || invitation?.hero_caption?.trim()
    || `You're invited to celebrate with ${coupleName}.`
  );
}

function pickImage(invitation) {
  const image = invitation?.cover_image || invitation?.opening_hero_image || '';
  return typeof image === 'string' && image.startsWith('http') ? image : '';
}

export function applyInvitationPageMeta({ event, invitation } = {}) {
  if (typeof document === 'undefined') return;

  const coupleName = getCoupleDisplayName(event, invitation);
  const description = pickDescription(event, invitation, coupleName);
  const image = pickImage(invitation);

  document.title = coupleName;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', coupleName);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
  upsertMeta('name', 'twitter:title', coupleName);
  upsertMeta('name', 'twitter:description', description);

  if (image) {
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:image', image);
  }
}

export function resetInvitationPageMeta() {
  if (typeof document === 'undefined') return;
  document.title = DEFAULT_TITLE;
}
