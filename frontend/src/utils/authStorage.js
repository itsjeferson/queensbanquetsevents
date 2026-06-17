const USER_KEY = 'user';
const TOKEN_KEY = 'token';

function readUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export const authStorage = {
  getUser: readUser,
  setUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    sessionStorage.removeItem(USER_KEY);
  },
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  clear() {
    this.clearUser();
    this.clearToken();
  },
  clearLegacyStorage() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
