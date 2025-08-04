import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Meeting-PJ App</Text>
      <Text style={styles.subtitle}>แอปสำหรับจัดการห้องประชุม</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  subtitle: { fontSize: 18, marginBottom: 32, color: '#555' },
  loginButton: { marginTop: 24, padding: 12, backgroundColor: '#007bff', borderRadius: 8 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});