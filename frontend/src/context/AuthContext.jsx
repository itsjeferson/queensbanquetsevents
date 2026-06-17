import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { authStorage } from '../utils/authStorage';
import { isAdminRole } from '../utils/roles';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authStorage.clearLegacyStorage();
    setUser(authStorage.getUser());
    setLoading(false);
  }, []);

  const buildUserFromResponse = (email, data) => {
    const role = data.role || 'client';
    const firstName = data.first_name || data.firstName || '';
    const lastName = data.last_name || data.lastName || '';
    const name = data.name || `${firstName} ${lastName}`.trim() || email.split('@')[0];
    const initials = data.initials || `${firstName[0] || ''}${lastName[0] || name[0] || ''}`.toUpperCase();
    return { ...data, id: data.id, email: data.email || email, role, name, initials };
  };

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    const userData = buildUserFromResponse(email, response.data || { email });
    setUser(userData);
    authStorage.setUser(userData);
    if (response.token) authStorage.setToken(response.token);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    const userData = buildUserFromResponse(data.email, response.data || {
      ...data,
      role: 'client',
      initials: `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`,
    });
    setUser(userData);
    authStorage.setUser(userData);
    if (response.token) authStorage.setToken(response.token);
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authStorage.clear();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: isAdminRole(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
}
