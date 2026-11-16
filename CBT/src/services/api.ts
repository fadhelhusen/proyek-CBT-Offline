// Semua akses ke Supabase lewat file ini.
import { supabase } from '@/lib/supabase';
import type {
  Akun, AkunInput, JenisRef, Kredensial, Referensi, RingkasanAdmin, SessionUser,
  Ujian, UjianAdmin, UjianInput, UjianStatus,
} from '@/data/types';

type UjianRow = {
  id: string; judul: string; mapel: string; kelas: string;
  guru_id: string; status: UjianStatus;
};

const keUjian = (r: UjianRow): Ujian => ({
  id: r.id, judul: r.judul, mapel: r.mapel, kelas: r.kelas,
  guruId: r.guru_id, status: r.status,
});

export async function loginUser(username: string, password: string): Promise<SessionUser | null> {
  const { data, error } = await supabase.rpc('login_user', {
    p_username: username.trim(),
    p_password: password,
  });
  if (error) {
    console.log('LOGIN ERROR:', error.message);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}

export async function ujianMilikGuru(guruId: string): Promise<Ujian[]> {
  const { data, error } = await supabase
    .from('ujian').select('*').eq('guru_id', guruId).order('created_at', { ascending: true });
  if (error) { console.log('UJIAN ERROR:', error.message); return []; }
  return (data as UjianRow[]).map(keUjian);
}

export async function ujianTerbaru(limit = 5): Promise<Ujian[]> {
  const { data, error } = await supabase
    .from('ujian').select('*').order('created_at', { ascending: false }).limit(limit);
  if (error) { console.log('UJIAN ERROR:', error.message); return []; }
  return (data as UjianRow[]).map(keUjian);
}

export async function ringkasanAdmin(): Promise<RingkasanAdmin> {
  const kosong = { siswa: 0, guru: 0, kelas: 0, terjadwal: 0 };
  const { data, error } = await supabase.rpc('ringkasan_admin');
  if (error) { console.log('RINGKASAN ERROR:', error.message); return kosong; }
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? kosong;
}

/* ---------- CRUD akun (khusus admin) ---------- */
export async function adminListAkun(k: Kredensial): Promise<Akun[]> {
  const { data, error } = await supabase.rpc('admin_list_users', {
    p_admin: k.username,
    p_pass: k.password,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as Akun[];
}

export async function adminTambahAkun(k: Kredensial, a: AkunInput, password: string): Promise<void> {
  const { error } = await supabase.rpc('admin_create_user', {
    p_admin: k.username,
    p_pass: k.password,
    p_username: a.username,
    p_password: password,
    p_nama: a.nama,
    p_role: a.role,
    p_kelas: a.kelas,
    p_mapel: a.mapel,
  });
  if (error) throw new Error(error.message);
}

export async function adminUbahAkun(
  k: Kredensial, id: string, a: AkunInput, passwordBaru?: string,
): Promise<void> {
  const { error } = await supabase.rpc('admin_update_user', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
    p_username: a.username,
    p_nama: a.nama,
    p_role: a.role,
    p_kelas: a.kelas,
    p_mapel: a.mapel,
    p_password_baru: passwordBaru ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function adminHapusAkun(k: Kredensial, id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_user', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
  });
  if (error) throw new Error(error.message);
}

/* ---------- CRUD ujian (khusus admin) ---------- */
type UjianAdminRow = UjianRow & { guru_nama: string };

export async function adminListUjian(k: Kredensial): Promise<UjianAdmin[]> {
  const { data, error } = await supabase.rpc('admin_list_ujian', {
    p_admin: k.username,
    p_pass: k.password,
  });
  if (error) throw new Error(error.message);
  return ((data ?? []) as UjianAdminRow[]).map((r) => ({ ...keUjian(r), guruNama: r.guru_nama }));
}

export async function adminTambahUjian(k: Kredensial, u: UjianInput): Promise<void> {
  const { error } = await supabase.rpc('admin_create_ujian', {
    p_admin: k.username,
    p_pass: k.password,
    p_judul: u.judul,
    p_mapel: u.mapel,
    p_kelas: u.kelas,
    p_guru_id: u.guruId,
    p_status: u.status,
  });
  if (error) throw new Error(error.message);
}

export async function adminUbahUjian(k: Kredensial, id: string, u: UjianInput): Promise<void> {
  const { error } = await supabase.rpc('admin_update_ujian', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
    p_judul: u.judul,
    p_mapel: u.mapel,
    p_kelas: u.kelas,
    p_guru_id: u.guruId,
    p_status: u.status,
  });
  if (error) throw new Error(error.message);
}

export async function adminHapusUjian(k: Kredensial, id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_ujian', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
  });
  if (error) throw new Error(error.message);
}

/* ---------- Kelas & mapel (khusus admin) ---------- */
export async function adminListRef(k: Kredensial, jenis: JenisRef): Promise<Referensi[]> {
  const { data, error } = await supabase.rpc('admin_list_referensi', {
    p_admin: k.username,
    p_pass: k.password,
    p_jenis: jenis,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as Referensi[];
}

export async function adminTambahRef(k: Kredensial, jenis: JenisRef, nama: string): Promise<void> {
  const { error } = await supabase.rpc('admin_create_referensi', {
    p_admin: k.username,
    p_pass: k.password,
    p_jenis: jenis,
    p_nama: nama,
  });
  if (error) throw new Error(error.message);
}

export async function adminUbahRef(k: Kredensial, id: string, nama: string): Promise<void> {
  const { error } = await supabase.rpc('admin_update_referensi', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
    p_nama: nama,
  });
  if (error) throw new Error(error.message);
}

export async function adminHapusRef(k: Kredensial, id: string): Promise<void> {
  const { error } = await supabase.rpc('admin_delete_referensi', {
    p_admin: k.username,
    p_pass: k.password,
    p_id: id,
  });
  if (error) throw new Error(error.message);
}