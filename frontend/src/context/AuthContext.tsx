import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  role: 'athlete' | 'official';
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize from local storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Validate token with backend and get fresh user data
        const { user: freshUser } = await api.getMe();
        
        setIsAuthenticated(true);
        setUser(freshUser as User);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch (e) {
        console.error("Session restoration failed:", e);
        // Token might be expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, newUser: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
