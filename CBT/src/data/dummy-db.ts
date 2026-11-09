// Database dummy (memori). Bentuknya sengaja meniru tabel Supabase nanti:
//   tabel `users`  -> USERS
//   tabel `ujian`  -> UJIAN
// Kelak cukup diganti dengan query supabase.from('users') / from('ujian').
import type { Role } from '@/constants/roles';

export type User = {
  id: string;
  username: string; // NISN untuk siswa
  password: string; // HANYA untuk dummy. Jangan simpan password polos di database sungguhan.
  nama: string;
  role: Role;
  kelas?: string; // siswa
  mapel?: string; // guru
};

export type SessionUser = Omit<User, 'password'>;

export type UjianStatus = 'berlangsung' | 'terjadwal' | 'selesai';

export type Ujian = {
  id: string;
  judul: string;
  mapel: string;
  kelas: string;
  guruId: string;
  status: UjianStatus;
};

export const USERS: User[] = [
  { id: 's1', username: '2488010000', password: 'siswa123', nama: 'Siswa Contoh', role: 'siswa', kelas: 'X-A' },
  { id: 's2', username: '2488010001', password: 'siswa123', nama: 'Budi Santoso', role: 'siswa', kelas: 'X-A' },
  { id: 's3', username: '2488010002', password: 'siswa123', nama: 'Citra Lestari', role: 'siswa', kelas: 'X-B' },
  { id: 'g1', username: 'guru01', password: 'guru123', nama: 'Bu Sari, S.Pd.', role: 'guru', mapel: 'Matematika' },
  { id: 'g2', username: 'guru02', password: 'guru123', nama: 'Pak Andi, S.Pd.', role: 'guru', mapel: 'B. Indonesia' },
  { id: 'a1', username: 'admin', password: 'admin123', nama: 'Operator Sekolah', role: 'admin' },
];

export const UJIAN: Ujian[] = [
  { id: 'mtk-xa', judul: 'UTS Matematika', mapel: 'Matematika', kelas: 'X-A', guruId: 'g1', status: 'berlangsung' },
  { id: 'mtk-xb', judul: 'Quiz Aljabar', mapel: 'Matematika', kelas: 'X-B', guruId: 'g1', status: 'terjadwal' },
  { id: 'mtk-xc', judul: 'UH Trigonometri', mapel: 'Matematika', kelas: 'X-C', guruId: 'g1', status: 'selesai' },
  { id: 'bin-xa', judul: 'UTS B. Indonesia', mapel: 'B. Indonesia', kelas: 'X-A', guruId: 'g2', status: 'terjadwal' },
];

/* ---------- Fungsi akses (nantinya jadi query Supabase) ---------- */
export function cariUser(username: string, password: string): SessionUser | null {
  const u = USERS.find((x) => x.username === username.trim() && x.password === password);
  if (!u) return null;
  const { password: _pw, ...aman } = u;
  return aman;
}

export const ujianMilikGuru = (guruId: string) => UJIAN.filter((u) => u.guruId === guruId);
export const ujianUntukKelas = (kelas: string) => UJIAN.filter((u) => u.kelas === kelas);

export function ringkasanAdmin() {
  return {
    siswa: USERS.filter((u) => u.role === 'siswa').length,
    guru: USERS.filter((u) => u.role === 'guru').length,
    kelas: new Set(UJIAN.map((u) => u.kelas)).size,
    terjadwal: UJIAN.filter((u) => u.status === 'terjadwal').length,
  };
}
