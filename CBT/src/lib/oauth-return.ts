// Membaca URL tepat SEKALI saat bundle dimuat, sebelum expo-router sempat
// mengubahnya. Dipakai untuk menangkap hasil login Google (?code= atau ?error=)
// walaupun router tidak mendarat di layar /auth/callback.
type OAuthBoot = {
  isCallback: boolean;
  code: string | null;
  error: string | null;
  started: boolean;
};

function baca(): OAuthBoot {
  const kosong: OAuthBoot = {
    isCallback: false,
    code: null,
    error: null,
    started: false,
  };

  if (typeof window === 'undefined') return kosong;

  try {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
    const ambil = (key: string) =>
      url.searchParams.get(key) ?? hash.get(key);

    const code = ambil('code');
    const error = ambil('error_description') ?? ambil('error');
    const dariCallback = url.pathname.startsWith('/auth/callback');

    return {
      isCallback: dariCallback || !!code || !!error,
      code,
      error,
      started: false,
    };
  } catch {
    return kosong;
  }
}

export const oauthBoot: OAuthBoot = baca();