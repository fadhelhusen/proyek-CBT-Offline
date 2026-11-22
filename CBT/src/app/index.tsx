// src/app/index.tsx — pintu masuk aplikasi.
// Jika aplikasi dibuka dari hasil login Google (?code= atau ?error=),
// tampilkan proses verifikasinya; jika tidak, mulai dari splash.
import { Redirect } from 'expo-router';

import { OAuthCallbackView } from '@/components/OAuthCallbackView';
import { oauthBoot } from '@/lib/oauth-return';

export default function Index() {
  if (oauthBoot.isCallback) {
    return <OAuthCallbackView />;
  }

  return <Redirect href="/splash" />;
}