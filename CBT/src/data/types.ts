import type { Role } from '@/constants/roles';

export type SessionUser = {
  id: string;
  username: string;
  nama: string;
  role: Role;
  kelas?: string | null;
  mapel?: string | null;
};

export type UjianStatus = 'berlangsung' | 'terjadwal' | 'selesai';

export type Ujian = {
  id: string;
  judul: string;
  mapel: string;
  kelas: string;
  guruId: string;
  status: UjianStatus;
};

export type RingkasanAdmin = {
  siswa: number;
  guru: number;
  kelas: number;
  terjadwal: number;
};

/* ---------- CRUD akun ---------- */
export type Akun = {
  id: string;
  username: string;
  nama: string;
  role: Role;
  kelas?: string | null;
  mapel?: string | null;
};

export type AkunInput = {
  username: string;
  nama: string;
  role: Role;
  kelas: string | null;
  mapel: string | null;
};

export type Kredensial = { username: string; password: string };

/* ---------- CRUD ujian ---------- */
export type UjianAdmin = Ujian & { guruNama: string };

export type UjianInput = {
  judul: string;
  mapel: string;
  kelas: string;
  guruId: string;
  status: UjianStatus;
};

/* ---------- Kelas & mapel ---------- */
export type JenisRef = 'kelas' | 'mapel';
export type Referensi = { id: string; nama: string; dipakai: number };