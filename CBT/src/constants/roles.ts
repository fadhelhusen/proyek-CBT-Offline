import type { Href } from 'expo-router';

export type Role = 'admin' | 'guru' | 'siswa';

// Halaman utama tiap peran. Dipakai setelah login/verifikasi berhasil:
//   router.replace(ROLE_HOME[user.role]);
export const ROLE_HOME: Record<Role, Href> = {
  siswa: '/home-dashboard',
  guru: '/dashboard-guru',
  admin: '/dashboard-admin',
} as Record<Role, Href>;

export const ROLE_LABEL: Record<Role, string> = {
  siswa: 'Siswa',
  guru: 'Guru',
  admin: 'Admin',
};
