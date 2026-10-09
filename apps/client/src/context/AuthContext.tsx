import { createContext, useContext, useState } from 'react';
import type { AuthenticatedUser } from '@petlanka/types';

interface AuthCtx {
  user: AuthenticatedUser | null;
  setAuth: (user: AuthenticatedUser, tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthenticatedUser) : null;
  });

  const setAuth = (u: AuthenticatedUser, tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const clearAuth = () => {
    ['accessToken', 'refreshToken', 'user'].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setAuth, clearAuth }}>{children}</AuthContext.Provider>;
}
