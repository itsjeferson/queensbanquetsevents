function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pickCoupleName(event, invitation) {
  return (
    invitation?.couple_display_name?.trim()
    || event?.event_name?.trim()
    || 'Wedding Invitation'
  );
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

export default async function handler(req, res) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const guest = req.query.guest === '1' ? '1' : '';

  const siteUrl = (process.env.VITE_PUBLIC_SITE_URL || 'https://queensbanquetsevents.vercel.app').replace(/\/$/, '');
  const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || 'https://queens-banquet-api.onrender.com').replace(/\/$/, '');

  let title = 'Wedding Invitation';
  let description = "You're invited to celebrate with us.";
  let image = '';

  try {
    const endpoint = slug
      ? `${apiUrl}/invitations/preview/${encodeURIComponent(slug)}`
      : code
        ? `${apiUrl}/invitations/code/${encodeURIComponent(code)}`
        : null;

    if (endpoint) {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (response.ok) {
        const payload = await response.json();
        const event = payload?.data?.event;
        const invitation = payload?.data?.invitation;
        title = pickCoupleName(event, invitation);
        description = pickDescription(event, invitation, title);
        image = pickImage(invitation);
      }
    }
  } catch {
    // Fall back to generic preview copy.
  }

  const redirectParams = new URLSearchParams();
  if (slug) redirectParams.set('open', slug);
  if (code) redirectParams.set('code', code);
  if (guest) redirectParams.set('guest', guest);
  const redirectUrl = `${siteUrl}/?${redirectParams.toString()}`;
  const shareUrl = slug
    ? `${siteUrl}/share/${encodeURIComponent(slug)}${guest ? '?guest=1' : ''}`
    : code
      ? `${siteUrl}/share/by-code/${encodeURIComponent(code)}${guest ? '?guest=1' : ''}`
      : siteUrl;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
  <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
  <meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}" />
  <script>location.replace(${JSON.stringify(redirectUrl)})</script>
</head>
<body>
  <p>Opening invitation for ${escapeHtml(title)}…</p>
  <p><a href="${escapeHtml(redirectUrl)}">Continue to invitation</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
