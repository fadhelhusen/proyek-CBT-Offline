// [DEBUG-SEMENTARA] Jejak langkah login yang tahan terhadap reload/redirect.
// Disimpan di localStorage dan ditampilkan di halaman login.
const KEY = 'cbt_debug_trace';

export function debugLog(msg: string): void {
  if (typeof window === 'undefined') return;

  try {
    const waktu = new Date().toLocaleTimeString('id-ID');
    const lama = JSON.parse(
      window.localStorage.getItem(KEY) || '[]'
    ) as string[];

    lama.push(`${waktu}  ${msg}`);
    window.localStorage.setItem(KEY, JSON.stringify(lama.slice(-40)));
  } catch {
    // abaikan
  }

  console.log('[DEBUG]', msg);
}

export function readDebug(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearDebug(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // abaikan
  }
}