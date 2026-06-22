export function getPublicSiteOrigin() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function getInvitationShareUrl({ slug, inviteCode } = {}) {
  const origin = getPublicSiteOrigin();

  if (slug) {
    return `${origin}/#/invite/${encodeURIComponent(slug)}`;
  }

  if (inviteCode) {
    return `${origin}/#/event/${encodeURIComponent(inviteCode)}`;
  }

  if (typeof window === 'undefined') return origin;

  const { pathname, hash } = window.location;
  const base = `${origin}${pathname}${hash || ''}`;
  return base.split('?')[0];
}
