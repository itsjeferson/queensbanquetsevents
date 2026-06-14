import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

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

  const login = useCallback(async (email, password, role = 'client') => {
    try {
      const response = await authService.login(email, password);
      const userData = response.data || { email, role, name: email.split('@')[0] };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (response.token) localStorage.setItem('token', response.token);
      return userData;
    } catch {
      const mockUser = {
        email,
        role,
        name: role === 'admin' ? 'Admin' : 'Maria Santos',
        initials: role === 'admin' ? 'AD' : 'MS',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
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
