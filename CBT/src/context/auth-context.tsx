import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '@/services/api';
import type { Kredensial, SessionUser } from '@/data/types';

type AuthContextType = {
  user: SessionUser | null;
  /** username + password admin untuk memanggil fungsi CRUD. null untuk guru/siswa */
  kredensial: Kredensial | null;
  /** mengembalikan user bila cocok, null bila salah / gagal */
  login: (username: string, password: string) => Promise<SessionUser | null>;
  logout: () => void;
  /** dipanggil saat admin mengubah username/password akunnya sendiri */
  perbaruiKredensial: (data: Partial<Kredensial>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [kredensial, setKredensial] = useState<Kredensial | null>(null);

  const login = async (username: string, password: string) => {
    const found = await loginUser(username, password);
    setUser(found);
    setKredensial(found?.role === 'admin' ? { username: username.trim(), password } : null);
    return found;
  };

  const logout = () => {
    setUser(null);
    setKredensial(null);
  };

  const perbaruiKredensial = (data: Partial<Kredensial>) =>
    setKredensial((k) => (k ? { ...k, ...data } : k));

  return (
    <AuthContext.Provider value={{ user, kredensial, login, logout, perbaruiKredensial }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}