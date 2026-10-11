'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company?: string | null;
  title?: string | null;
  role: 'CLIENT' | 'FREELANCER' | 'ARBITRATOR';
  avatarUrl?: string | null;
  balance: number;
  inEscrow: number;
  withdrawable: number;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  availableUsers: AuthUser[];
  switchUser: (userId: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    company?: string;
    title?: string;
    role: 'CLIENT' | 'FREELANCER';
    startingBalance?: number;
  }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [availableUsers, setAvailableUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const json = await res.json();
      if (res.ok && json.success) {
        setAvailableUsers(json.data);
        return json.data as AuthUser[];
      }
    } catch (e) {
      console.warn('Failed to fetch users list:', e);
    }
    return [];
  };

  const refreshUser = async () => {
    try {
      const savedId = localStorage.getItem('vb_active_user_id');
      const url = savedId ? `/api/auth/me?userId=${savedId}` : '/api/auth/me';
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentUser(json.data);
        localStorage.setItem('vb_active_user_id', json.data.id);
      }
    } catch (e) {
      console.warn('Failed to resolve current session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    refreshUser();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentUser(json.data.user);
        localStorage.setItem('vb_active_user_id', json.data.user.id);
        setIsAuthModalOpen(false);
      }
    } catch (e) {
      console.error('Switch user error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'viewbook123' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentUser(json.data.user);
        localStorage.setItem('vb_active_user_id', json.data.user.id);
        setIsAuthModalOpen(false);
        return true;
      } else {
        alert(json.error || 'Login failed');
        return false;
      }
    } catch (e: any) {
      alert(e.message || 'Login error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    company?: string;
    title?: string;
    role: 'CLIENT' | 'FREELANCER';
    startingBalance?: number;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentUser(json.data.user);
        localStorage.setItem('vb_active_user_id', json.data.user.id);
        await fetchUsers();
        setIsAuthModalOpen(false);
        return true;
      } else {
        alert(json.error || 'Registration failed');
        return false;
      }
    } catch (e: any) {
      alert(e.message || 'Registration error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('vb_active_user_id');
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        availableUsers,
        switchUser,
        login,
        register,
        logout,
        refreshUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}