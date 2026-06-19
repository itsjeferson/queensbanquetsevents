import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { authService } from '../services/authService';
import { authStorage } from '../utils/authStorage';
import { isAdminRole } from '../utils/roles';

export const AuthContext = createContext(null);

function buildUserFromResponse(email, data) {
  const role = data?.role || 'client';
  const firstName = data.first_name || data.firstName || '';
  const lastName = data.last_name || data.lastName || '';
  const name = data.name || `${firstName} ${lastName}`.trim() || email.split('@')[0];
  const initials = data.initials || `${firstName[0] || ''}${lastName[0] || name[0] || ''}`.toUpperCase();
  return { ...data, id: data.id, email: data.email || email, role, name, initials };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef(0);

  const persistUser = useCallback((userData) => {
    flushSync(() => {
      setUser(userData);
    });
    authStorage.setUser(userData);
  }, []);

  const bumpSession = useCallback(() => {
    sessionRef.current += 1;
    return sessionRef.current;
  }, []);

  useEffect(() => {
    authStorage.clearLegacyStorage();

    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const sessionId = sessionRef.current;

    authService.getProfile()
      .then((profile) => {
        if (sessionId !== sessionRef.current) return;

        const profileData = profile.data || profile;
        if (!profileData?.role) return;

        const cachedUser = authStorage.getUser();
        const userData = buildUserFromResponse(
          profileData.email || cachedUser?.email || '',
          profileData,
        );
        persistUser(userData);
      })
      .catch(() => {
        if (sessionId !== sessionRef.current) return;

        const cachedUser = authStorage.getUser();
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          authStorage.clear();
          setUser(null);
        }
      })
      .finally(() => {
        if (sessionId === sessionRef.current) {
          setLoading(false);
        }
      });
  }, [persistUser]);

  const login = useCallback(async (email, password) => {
    bumpSession();

    const response = await authService.login(email, password);
    if (response.token) authStorage.setToken(response.token);

    const sessionId = sessionRef.current;
    let profileData = response.data;

    try {
      const profile = await authService.getProfile();
      profileData = profile.data || profileData;
    } catch {
      // Fall back to login payload if /auth/me is unavailable.
    }

    const userData = buildUserFromResponse(email, profileData || { email });

    if (sessionId === sessionRef.current) {
      persistUser(userData);
    }

    return userData;
  }, [bumpSession, persistUser]);

  const register = useCallback(async (data) => {
    bumpSession();
    const sessionId = sessionRef.current;

    const response = await authService.register(data);
    const userData = buildUserFromResponse(data.email, response.data || {
      ...data,
      role: 'client',
      initials: `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`,
    });

    if (response.token) authStorage.setToken(response.token);

    if (sessionId === sessionRef.current) {
      persistUser(userData);
    }

    return userData;
  }, [bumpSession, persistUser]);

  const logout = useCallback(() => {
    bumpSession();
    setUser(null);
    authStorage.clear();
  }, [bumpSession]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: isAdminRole(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
}
