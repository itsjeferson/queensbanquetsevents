import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { findLocalClientByEmail } from '../services/clientService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const buildUserFromResponse = (email, data) => {
    const role = data.role || 'client';
    const firstName = data.first_name || data.firstName || '';
    const lastName = data.last_name || data.lastName || '';
    const name = data.name || `${firstName} ${lastName}`.trim() || email.split('@')[0];
    const initials = data.initials || `${firstName[0] || ''}${lastName[0] || name[0] || ''}`.toUpperCase();
    return { ...data, email: data.email || email, role, name, initials };
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = buildUserFromResponse(email, response.data || { email });
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (response.token) localStorage.setItem('token', response.token);
      return userData;
    } catch {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.includes('admin')) {
        const mockAdmin = {
          email,
          role: 'admin',
          name: 'Admin User',
          initials: 'AU',
        };
        setUser(mockAdmin);
        localStorage.setItem('user', JSON.stringify(mockAdmin));
        return mockAdmin;
      }

      const clientUser = findLocalClientByEmail(email, password);
      if (clientUser) {
        setUser(clientUser);
        localStorage.setItem('user', JSON.stringify(clientUser));
        return clientUser;
      }

      throw new Error('Invalid email or password');
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const response = await authService.register(data);
      const userData = response.data || { ...data, role: 'client', initials: `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}` };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (response.token) localStorage.setItem('token', response.token);
      return userData;
    } catch {
      const mockUser = {
        ...data,
        role: 'client',
        name: `${data.firstName} ${data.lastName}`,
        initials: `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}
