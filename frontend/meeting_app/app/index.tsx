import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.logoImg}
        />
        <Text style={styles.logo}>Meeting-PJ</Text>
        <Text style={styles.subtitle}>แอปสำหรับจัดการห้องประชุม</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.dashboardBtn]}>
            <Text style={styles.buttonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e7ff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: 340,
  },
  logoImg: {
    width: 72,
    height: 72,
    marginBottom: 16,
    borderRadius: 36,
    backgroundColor: '#f3f4f6',
  },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', color: '#2563eb' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 28, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', marginBottom: 8 },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginHorizontal: 8,
    elevation: 2,
  },
  dashboardBtn: {
    backgroundColor: '#22c55e',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
