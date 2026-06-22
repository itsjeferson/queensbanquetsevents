export function getPublicSiteOrigin() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Share paths use /share/:slug so link previews get couple-specific Open Graph tags
 * from the share-preview API before redirecting guests into the app.
 */
export function getInvitationSharePath({ slug, inviteCode, guestPreview = false } = {}) {
  const params = new URLSearchParams();
  if (guestPreview) params.set('guest', '1');
  const query = params.toString();
  const suffix = query ? `?${query}` : '';

  if (slug) {
    return `/share/${encodeURIComponent(slug)}${suffix}`;
  }

  if (inviteCode) {
    return `/share/by-code/${encodeURIComponent(inviteCode)}${suffix}`;
  }

  return '';
}

export function getInvitationShareUrl(options = {}) {
  const origin = getPublicSiteOrigin();
  const path = getInvitationSharePath(options);

  if (path) {
    return `${origin}${path}`;
  }

  return origin || '';
}
