export function getPublicSiteOrigin() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Path-only link (no hash) — works reliably in QR codes and phone cameras. */
export function getInvitationSharePath({ slug, inviteCode } = {}) {
  if (slug) {
    return `/invite/${encodeURIComponent(slug)}`;
  }

  if (inviteCode) {
    return `/i/${encodeURIComponent(inviteCode)}`;
  }

  return '';
}

export function getInvitationShareUrl({ slug, inviteCode } = {}) {
  const origin = getPublicSiteOrigin();
  const path = getInvitationSharePath({ slug, inviteCode });

  if (path) {
    return `${origin}${path}`;
  }

  return origin || '';
}
