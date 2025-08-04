import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = typeof params.email === 'string' ? params.email : '';

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      Alert.alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://192.168.1.33:8000/api/v1/users/reset-password', {
        email,
        otp,
        password,
        passwordConfirm,
      });
      Alert.alert('เปลี่ยนรหัสผ่านสำเร็จ!', 'กรุณาเข้าสู่ระบบใหม่');
      router.push('/login');
    } catch (error: any) {
      Alert.alert('เกิดข้อผิดพลาด', error?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>
      <TextInput
        style={styles.input}
        placeholder="กรอกรหัส OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสผ่านใหม่"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="ยืนยันรหัสผ่านใหม่"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>รีเซ็ตรหัสผ่าน</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', padding: 16 },
  title: { fontSize: 20, color: '#111827', marginBottom: 24, fontWeight: '500', textAlign: 'center' },
  input: { width: 280, borderRadius: 8, backgroundColor: '#d1d5db', padding: 14, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: 180, marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});