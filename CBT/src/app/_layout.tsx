import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="login-error" />
      <Stack.Screen name="home-dashboard" />
      <Stack.Screen name="ujian-list" />
    </Stack>
  );
}