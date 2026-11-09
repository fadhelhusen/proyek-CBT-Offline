// Semua akses ke Supabase lewat file ini (menggantikan fungsi di data/dummy-db.ts).
import { supabase } from '@/lib/supabase';
import type { RingkasanAdmin, SessionUser, Ujian, UjianStatus } from '@/data/types';

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