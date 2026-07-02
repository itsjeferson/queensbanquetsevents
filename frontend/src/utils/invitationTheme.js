import { normalizeColorToHex } from './colorInput';

export const PALETTE_COLOR_COUNT = 6;
export const ATTIRE_COLOR_COUNT = 4;
export const PALETTE_DEFAULT_COLOR = '#FFFFFF';
export const ATTIRE_SWATCH_DEFAULT = PALETTE_DEFAULT_COLOR;

export const PALETTE_COLOR_LABELS = [
  'Headings',
  'Background',
  'Section Background',
  'Accent',
  'Floral Bloom',
  'Floral Detail',
];

export const INVITATION_MOTIFS = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    primary_color: '#B47B36',
    secondary_color: '#F4EEE7',
    background_color: '#FFFAF5',
    accent_colors: ['#F4EEE7', '#D4AF37', '#C27691', '#8B4513'],
  },
  {
    id: 'blush-rose',
    name: 'Blush Rose',
    primary_color: '#C27691',
    secondary_color: '#FBF0F3',
    background_color: '#FFF8FA',
    accent_colors: ['#FBF0F3', '#E8A4B8', '#C27691', '#8E4A63'],
  },
  {
    id: 'sage-garden',
    name: 'Sage Garden',
    primary_color: '#6B8F71',
    secondary_color: '#F2F6F0',
    background_color: '#F8FBF8',
    accent_colors: ['#F2F6F0', '#A8C3A0', '#6B8F71', '#3E5C44'],
  },
  {
    id: 'navy-elegance',
    name: 'Navy Elegance',
    primary_color: '#2C3E50',
    secondary_color: '#EEF2F6',
    background_color: '#F7F9FB',
    accent_colors: ['#EEF2F6', '#5D6D7E', '#2C3E50', '#1A252F'],
  },
  {
    id: 'burgundy-wine',
    name: 'Burgundy Wine',
    primary_color: '#7B2D42',
    secondary_color: '#F8F0F2',
    background_color: '#FDF8F9',
    accent_colors: ['#F8F0F2', '#B85C72', '#7B2D42', '#4A1A28'],
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    primary_color: '#8B7BA8',
    secondary_color: '#F5F2FA',
    background_color: '#FAF8FD',
    accent_colors: ['#F5F2FA', '#C4B5D6', '#8B7BA8', '#5E4F75'],
  },
  {
    id: 'champagne-cream',
    name: 'Champagne Cream',
    primary_color: '#A68B5B',
    secondary_color: '#FAF6EF',
    background_color: '#FFFCF7',
    accent_colors: ['#FAF6EF', '#D4BC8A', '#A68B5B', '#6B5435'],
  },
  {
    id: 'custom',
    name: 'Custom Colors',
    primary_color: PALETTE_DEFAULT_COLOR,
    secondary_color: PALETTE_DEFAULT_COLOR,
    background_color: PALETTE_DEFAULT_COLOR,
    accent_colors: [PALETTE_DEFAULT_COLOR, PALETTE_DEFAULT_COLOR, PALETTE_DEFAULT_COLOR, PALETTE_DEFAULT_COLOR],
  },
];

function padPalette(colors = [], fallback = PALETTE_DEFAULT_COLOR, count = PALETTE_COLOR_COUNT) {
  const padded = colors.length >= count
    ? colors.slice(0, count)
    : [...colors, ...Array(count - colors.length).fill(fallback)].slice(0, count);

  return padded.map((color) => normalizeColorToHex(color || fallback, fallback));
}

function parseHex(hex) {
  const value = String(hex || '').replace('#', '').trim();
  if (value.length === 3) {
    return {
      r: parseInt(value[0] + value[0], 16),
      g: parseInt(value[1] + value[1], 16),
      b: parseInt(value[2] + value[2], 16),
    };
  }
  if (value.length !== 6) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function darkenHex(hex, amount = 0.15) {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const mix = (channel) => Math.max(0, Math.round(channel * (1 - amount)));
  const toHex = (channel) => mix(channel).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbaFromHex(hex, alpha) {
  const rgb = parseHex(hex);
  if (!rgb) return `rgba(180, 123, 54, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function getMotifById(motifId) {
  return INVITATION_MOTIFS.find((motif) => motif.id === motifId) || INVITATION_MOTIFS[0];
}

export function getMotifPaletteColors(motif) {
  return padPalette([
    motif.primary_color,
    motif.background_color,
    motif.secondary_color,
    motif.accent_colors[1] || motif.primary_color,
    motif.accent_colors[2] || motif.primary_color,
    motif.accent_colors[3] || motif.primary_color,
  ]);
}

export function getMotifPreviewColors(motif) {
  return getMotifPaletteColors(motif);
}

export function resolveInvitationPalette(invitation = {}, motif = getMotifById(invitation.color_motif || 'classic-gold')) {
  if (Array.isArray(invitation.palette_colors) && invitation.palette_colors.length >= PALETTE_COLOR_COUNT) {
    return padPalette(invitation.palette_colors);
  }

  if ((invitation.color_motif || 'classic-gold') === 'custom') {
    return padPalette([
      invitation.primary_color,
      invitation.background_color,
      invitation.secondary_color,
      invitation.palette_colors?.[3],
      invitation.palette_colors?.[4],
      invitation.palette_colors?.[5],
    ]);
  }

  return getMotifPaletteColors(motif);
}

export function getFloralThemeColors(invitation = {}) {
  const styles = getInvitationThemeStyles(invitation);
  return {
    bloom: styles['--inv-floral-bloom'],
    bloomSoft: styles['--inv-floral-bloom-soft'],
    leaf: styles['--inv-floral-leaf'],
    leafSoft: styles['--inv-floral-leaf-soft'],
    line: styles['--inv-floral-line'],
  };
}

export function applyMotifToInvitation(invitation, motifId) {
  const motif = getMotifById(motifId);

  if (motifId === 'custom') {
    const palette = Array.isArray(invitation.palette_colors) && invitation.palette_colors.length >= PALETTE_COLOR_COUNT
      ? getInvitationPaletteColors(invitation, motif)
      : Array(PALETTE_COLOR_COUNT).fill(PALETTE_DEFAULT_COLOR);
    return applyCustomPaletteColors(invitation, palette);
  }

  const palette = getMotifPaletteColors(motif);

  return {
    color_motif: motif.id,
    primary_color: palette[0],
    background_color: palette[1],
    secondary_color: palette[2],
    palette_colors: palette,
  };
}

export function getInvitationPaletteColors(invitation = {}, fallbackMotif = getMotifById('classic-gold')) {
  return resolveInvitationPalette(invitation, fallbackMotif);
}

/** @deprecated Use getInvitationPaletteColors */
export function getCustomPaletteColors(invitation = {}, fallbackMotif = getMotifById('classic-gold')) {
  return getInvitationPaletteColors(invitation, fallbackMotif);
}

export function applyCustomPaletteColors(invitation = {}, colors = []) {
  const palette = padPalette(colors, PALETTE_DEFAULT_COLOR);

  return {
    color_motif: 'custom',
    primary_color: palette[0],
    background_color: palette[1],
    secondary_color: palette[2],
    palette_colors: palette,
  };
}

/** Only non-default swatch colors appear on the public invitation. */
export function getCustomizedAttireColors(colors = []) {
  if (!Array.isArray(colors)) return [];

  return colors
    .slice(0, ATTIRE_COLOR_COUNT)
    .filter((color) => {
      if (!color?.trim()) return false;
      return normalizeColorToHex(color) !== normalizeColorToHex(ATTIRE_SWATCH_DEFAULT);
    })
    .map((color) => normalizeColorToHex(color));
}

export function getInvitationTheme(invitation = {}) {
  const motifId = invitation.color_motif || 'classic-gold';
  const motif = getMotifById(motifId);
  const palette = resolveInvitationPalette(invitation, motif);
  const primary = palette[0] || motif.primary_color;

  return {
    primary,
    secondary: palette[2] || motif.secondary_color,
    background: palette[1] || motif.background_color,
    primary_dark: darkenHex(primary, 0.18),
    palette,
    accent_colors: invitation.attire?.ladies_colors?.length
      ? invitation.attire.ladies_colors.slice(0, ATTIRE_COLOR_COUNT)
      : motif.accent_colors,
  };
}

export function extractInvitationThemeInput(invitation = {}) {
  const story = invitation.story || {};
  return {
    color_motif: invitation.color_motif || story.color_motif,
    primary_color: invitation.primary_color,
    secondary_color: invitation.secondary_color || story.secondary_color,
    background_color: invitation.background_color || story.background_color,
    palette_colors: invitation.palette_colors,
  };
}

export function getInvitationThemeStyles(invitation = {}) {
  const themeInput = extractInvitationThemeInput(invitation);
  const theme = getInvitationTheme({ ...invitation, ...themeInput });
  const palette = theme.palette || resolveInvitationPalette({ ...invitation, ...themeInput });
  const rgb = parseHex(theme.primary);
  const bloom = palette[4] || theme.primary;
  const leaf = palette[5] || theme.primary_dark;

  return {
    '--inv-primary': theme.primary,
    '--inv-primary-dark': theme.primary_dark,
    '--inv-paper': theme.secondary,
    '--inv-background': theme.background,
    '--inv-primary-rgb': rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '180, 123, 54',
    '--inv-primary-soft': rgbaFromHex(theme.primary, 0.1),
    '--inv-primary-soft-strong': rgbaFromHex(theme.primary, 0.18),
    '--inv-primary-border': rgbaFromHex(theme.primary, 0.28),
    '--inv-primary-shadow': rgbaFromHex(theme.primary, 0.35),
    '--inv-floral-bloom': bloom,
    '--inv-floral-bloom-soft': rgbaFromHex(bloom, 0.62),
    '--inv-floral-leaf': leaf,
    '--inv-floral-leaf-soft': rgbaFromHex(leaf, 0.72),
    '--inv-floral-line': palette[3] || theme.primary,
    background: theme.background,
  };
}

export function buildInvitationThemeCss(invitation = {}) {
  const styles = getInvitationThemeStyles(invitation);
  const body = Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
  return `.invitation-page[data-inv-theme] { ${body} }`;
}

export function resolveInvitationThemeFields(invitation = {}) {
  const themeInput = extractInvitationThemeInput(invitation);
  const theme = getInvitationTheme({ ...invitation, ...themeInput });
  const palette = theme.palette || resolveInvitationPalette({ ...invitation, ...themeInput });

  return {
    color_motif: themeInput.color_motif || 'classic-gold',
    primary_color: theme.primary,
    secondary_color: theme.secondary,
    background_color: theme.background,
    palette_colors: palette,
  };
}
