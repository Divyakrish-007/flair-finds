import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickLogin: (role: 'admin' | 'user') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('flair_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('flair_token');
      if (storedToken) {
        try {
          const { user } = await authApi.getCurrentUser();
          setUser(user);
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('flair_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('flair_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authApi.register(name, email, password);
      localStorage.setItem('flair_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('flair_token');
    setToken(null);
    setUser(null);
  };

  const quickLogin = async (role: 'admin' | 'user') => {
    if (role === 'admin') {
      await login('admin@flairfinds.com', 'admin123');
    } else {
      await login('user@flairfinds.com', 'user123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
