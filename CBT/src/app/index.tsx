// src/app/index.tsx — pintu masuk aplikasi: selalu mulai dari splash
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}
