import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  loginUser,
  getOAuthProfile,
} from '@/services/api';

import { supabase } from '@/lib/supabase';
import { debugLog } from '@/lib/debug';
import { oauthBoot } from '@/lib/oauth-return';
import type {
  Kredensial,
  SessionUser,
} from '@/data/types';

type OAuthStatus = 'idle' | 'loading' | 'success' | 'error';

type AuthContextType = {
  user: SessionUser | null;
  kredensial: Kredensial | null;
  // true selama aplikasi masih memulihkan sesi / memproses login Google.
  initializing: boolean;
  oauthStatus: OAuthStatus;
  oauthError: string | null;
  login: (
    username: string,
    password: string
  ) => Promise<SessionUser | null>;
  loginWithGoogle: () => Promise<void>;
  completeOAuthLogin: (code: string) => Promise<SessionUser>;
  logout: () => Promise<void>;
  perbaruiKredensial: (data: Partial<Kredensial>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [kredensial, setKredensial] = useState<Kredensial | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [oauthStatus, setOAuthStatus] = useState<OAuthStatus>('idle');
  const [oauthError, setOAuthError] = useState<string | null>(null);

  // Login siswa menggunakan username dan password.
  const login = async (
    username: string,
    password: string
  ): Promise<SessionUser | null> => {
    const found = await loginUser(username, password);

    setUser(found);
    setKredensial(
      found?.role === 'admin'
        ? { username: username.trim(), password }
        : null
    );

    return found;
  };

  // Memulai login Google.
  const loginWithGoogle = async (): Promise<void> => {
    if (typeof window === 'undefined') {
      throw new Error('Login Google hanya tersedia melalui browser.');
    }

    setOAuthStatus('loading');
    setOAuthError(null);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      setOAuthStatus('error');
      setOAuthError(error.message);
      throw new Error(error.message);
    }

    if (!data.url) {
      setOAuthStatus('error');
      setOAuthError('URL login Google tidak berhasil dibuat.');
      throw new Error('URL login Google tidak berhasil dibuat.');
    }

    debugLog(
      'GOOGLE: menuju Google, redirectTo=' +
        window.location.origin +
        '/auth/callback'
    );

    window.location.assign(data.url);
  };

  // Menukar authorization code dan memvalidasi akun CBT.
  const completeOAuthLogin = async (
    code: string
  ): Promise<SessionUser> => {
    setOAuthStatus('loading');
    setOAuthError(null);

    try {
      const { data, error } =
        await supabase.auth.exchangeCodeForSession(code);
      debugLog(
        'EXCHANGE: ' + (error ? 'GAGAL ' + error.message : 'ok')
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error('Sesi Google tidak berhasil dibuat.');
      }

      const profile = await getOAuthProfile();
      debugLog(
        'PROFIL dari get_oauth_profile: ' + JSON.stringify(profile)
      );

      if (
        !profile ||
        !['admin', 'guru'].includes(profile.role)
      ) {
        throw new Error(
          'Akun Google ini belum terdaftar sebagai guru atau admin.'
        );
      }

      setUser(profile);
      setKredensial(null);
      setOAuthStatus('success');

      return profile;
    } catch (error) {
      await supabase.auth.signOut();

      setUser(null);
      setKredensial(null);
      setOAuthStatus('error');

      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memverifikasi akun Google.';

      setOAuthError(message);
      debugLog('OAUTH GAGAL: ' + message);
      throw new Error(message);
    }
  };

  // Logout dari Supabase.
  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
    setKredensial(null);
    setOAuthStatus('idle');
    setOAuthError(null);
  };

  const perbaruiKredensial = (
    data: Partial<Kredensial>
  ) => {
    setKredensial((k) => (k ? { ...k, ...data } : k));
  };

  // Pulihkan sesi Google (guru/admin) yang tersimpan di localStorage,
  // supaya refresh halaman tidak mengembalikan pengguna ke login.
  // Dilewati jika aplikasi dibuka dari hasil login Google.
  useEffect(() => {
    if (oauthBoot.isCallback) return;

    let active = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        debugLog(
          'RESTORE: ' +
            (data.session ? 'ada sesi Supabase' : 'tidak ada sesi')
        );

        if (data.session) {
          const profile = await getOAuthProfile();

          if (
            active &&
            profile &&
            ['admin', 'guru'].includes(profile.role)
          ) {
            setUser((current) => current ?? profile);
          }
        }
      } catch (error) {
        console.error('RESTORE SESSION ERROR:', error);
        debugLog(
          'RESTORE ERROR: ' +
            (error instanceof Error ? error.message : String(error))
        );
      } finally {
        if (active) setInitializing(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Proses hasil login Google (?code= atau ?error=) langsung di sini,
  // sehingga tidak bergantung pada layar mana yang sedang tampil.
  useEffect(() => {
    if (!oauthBoot.isCallback || oauthBoot.started) return;

    oauthBoot.started = true;

    (async () => {
      const code = oauthBoot.code;
      const rawError = oauthBoot.error;

      debugLog(
        'OAUTH-RETURN: code=' +
          (code ? 'ada' : 'tidak ada') +
          ', error=' +
          (rawError ?? 'tidak ada')
      );

      if (rawError) {
        const pesan = /exchange external code/i.test(rawError)
          ? 'Supabase gagal menukar kode dari Google ' +
            '(Unable to exchange external code). ' +
            'Periksa Client ID dan Client Secret Google di pengaturan ' +
            'Supabase, serta Authorized redirect URI di Google Cloud.'
          : rawError;

        setOAuthStatus('error');
        setOAuthError(pesan);
        return;
      }

      if (!code) {
        setOAuthStatus('error');
        setOAuthError(
          'Authorization code tidak ditemukan pada URL callback.'
        );
        return;
      }

      try {
        await completeOAuthLogin(code);
      } catch {
        // status error sudah diatur di completeOAuthLogin
      }
    })().finally(() => setInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        kredensial,
        initializing,
        oauthStatus,
        oauthError,
        login,
        loginWithGoogle,
        completeOAuthLogin,
        logout,
        perbaruiKredensial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}