import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('กรุณากรอกอีเมล');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://192.168.1.33:8000/api/v1/users/forget-password', { email });
      Alert.alert('สำเร็จ', 'รหัส OTP สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลของคุณแล้ว');
      router.push(`/resetpassword?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      Alert.alert('เกิดข้อผิดพลาด', error?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>กรอกอีเมลเพื่อขอรหัส OTP สำหรับรีเซ็ตรหัสผ่าน</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ขอรหัส OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', padding: 16 },
  title: { fontSize: 18, color: '#111827', marginBottom: 24, fontWeight: '500', textAlign: 'center' },
  input: { width: 280, borderRadius: 8, backgroundColor: '#d1d5db', padding: 14, marginBottom: 24, fontSize: 16 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: 180 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});