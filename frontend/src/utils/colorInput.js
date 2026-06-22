function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function componentToHex(value) {
  return clampByte(value).toString(16).padStart(2, '0');
}

function rgbToHex(red, green, blue) {
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`.toUpperCase();
}

function parseRgbComponent(value) {
  const trimmed = String(value).trim();
  if (trimmed.endsWith('%')) {
    const percent = parseFloat(trimmed.slice(0, -1));
    if (!Number.isFinite(percent)) return null;
    return (percent / 100) * 255;
  }

  const number = parseFloat(trimmed);
  if (!Number.isFinite(number)) return null;
  return number;
}

/** Parse pasted HEX or RGB/RGBA strings into #RRGGBB. Returns null when invalid. */
export function parseColorInput(input) {
  if (typeof input !== 'string') return null;

  const value = input.trim();
  if (!value) return null;

  const hexMatch = value.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('');
    }
    return `#${hex.slice(0, 6).toUpperCase()}`;
  }

  const rgbMatch = value.match(
    /^rgba?\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,)]+)(?:\s*,\s*[^)]+)?\s*\)$/i,
  );
  if (rgbMatch) {
    const red = parseRgbComponent(rgbMatch[1]);
    const green = parseRgbComponent(rgbMatch[2]);
    const blue = parseRgbComponent(rgbMatch[3]);
    if (red == null || green == null || blue == null) return null;
    return rgbToHex(red, green, blue);
  }

  return null;
}

export function normalizeColorToHex(value, fallback = '#F4EEE7') {
  const parsed = parseColorInput(value);
  if (parsed) return parsed;
  if (typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value.trim())) {
    return value.trim().toUpperCase();
  }
  return fallback;
}
