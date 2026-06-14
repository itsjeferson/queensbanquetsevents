export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\+?[\d\s-]{10,}$/.test(phone);
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}
