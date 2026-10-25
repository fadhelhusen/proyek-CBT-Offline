import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Utama CBT</Text>
      
      <Link href="/detail-ujian" style={styles.button}>
        Buka Detail Ujian
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#3B82F6',
    color: '#fff',
    borderRadius: 8,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});