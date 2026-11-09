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