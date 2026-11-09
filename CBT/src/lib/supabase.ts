import { createClient } from '@supabase/supabase-js';

// Nilai diambil dari file .env (awalan EXPO_PUBLIC_ wajib agar terbaca di aplikasi).
// HANYA anon key. JANGAN PERNAH memakai service_role key di sini.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // Belum memakai Supabase Auth, jadi sesi tidak perlu disimpan
  auth: { persistSession: false, autoRefreshToken: false },
});