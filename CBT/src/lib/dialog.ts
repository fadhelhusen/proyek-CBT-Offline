// Alert.alert tidak menampilkan apa pun di react-native-web,
// jadi gunakan window.confirm / window.alert saat berjalan di browser.
import { Alert, Platform } from 'react-native';

export function konfirmasiHapus(
  judul: string,
  pesan: string,
  onYa: () => void | Promise<void>
) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${judul}\n\n${pesan}`)) {
      void onYa();
    }
    return;
  }

  Alert.alert(judul, pesan, [
    { text: 'Batal', style: 'cancel' },
    { text: 'Hapus', style: 'destructive', onPress: () => void onYa() },
  ]);
}

export function tampilkanGalat(judul: string, pesan: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(`${judul}\n\n${pesan}`);
    return;
  }
  Alert.alert(judul, pesan);
}
