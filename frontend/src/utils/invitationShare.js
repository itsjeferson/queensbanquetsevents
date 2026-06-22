export function getPublicSiteOrigin() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Query-based paths survive phone QR scanners (hash fragments are often dropped).
 * Example: /?open=Mark-She
 */
export function getInvitationSharePath({ slug, inviteCode, guestPreview = false } = {}) {
  const params = new URLSearchParams();

  if (slug) {
    params.set('open', slug);
  } else if (inviteCode) {
    params.set('code', inviteCode);
  } else {
    return '';
  }

  if (guestPreview) {
    params.set('guest', '1');
  }

  return `/?${params.toString()}`;
}

export function getInvitationShareUrl(options = {}) {
  const origin = getPublicSiteOrigin();
  const path = getInvitationSharePath(options);

  if (path) {
    return `${origin}${path}`;
  }

  return origin || '';
}
