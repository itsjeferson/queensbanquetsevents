export function getPublicSiteOrigin() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Guest-facing path — served by SPA and handled in index.html bootstrap. */
export function getInvitationSharePath({ slug, inviteCode, guestPreview = false } = {}) {
  if (slug) {
    return `/invite/${encodeURIComponent(slug)}`;
  }

  if (inviteCode) {
    return `/i/${encodeURIComponent(inviteCode)}`;
  }

  return '';
}

/** Link-preview URL with couple-specific Open Graph tags from /api/share-preview. */
export function getInvitationPreviewSharePath({ slug, inviteCode, guestPreview = false } = {}) {
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

export function getInvitationPreviewShareUrl(options = {}) {
  const origin = getPublicSiteOrigin();
  const path = getInvitationPreviewSharePath(options);

  if (path) {
    return `${origin}${path}`;
  }

  return getInvitationShareUrl(options);
}
