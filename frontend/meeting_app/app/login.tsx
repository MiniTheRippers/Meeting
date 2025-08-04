import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // เปลี่ยน URL ให้ตรงกับ backend ของคุณ
      const res = await axios.post('http://192.168.1.33:8000/api/v1/users/login', formData);
      Alert.alert('เข้าสู่ระบบสำเร็จ');
      // ตรวจสอบ isVerified
      if (!res.data.data.user.isVerified) {
        router.push('/(tabs)/home');
      } else {
        router.push('/(tabs)/home');
      }
    } catch (error: any) {
      if (error.response) {
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', error.response.data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } else if (error.request) {
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } else {
        Alert.alert('เข้าสู่ระบบไม่สำเร็จ', 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>LOGO</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={v => handleChange('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={v => handleChange('password', v)}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/forgetpassword')}>
          <Text style={styles.forgetText}>Forget password</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          ยังไม่มีบัญชี?{' '}
          <Text
            style={{ color: '#2563eb', fontWeight: 'bold' }}
            onPress={() => router.push('/register')}
          >
            สมัครสมาชิก
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 320, elevation: 3, alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 24, marginTop: 8, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#f1f5f9', fontSize: 16 },
  button: { width: '100%', backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgetText: { color: '#ef4444', textAlign: 'right', width: '100%', marginTop: 8, fontSize: 14, fontWeight: 'bold' },
  signupText: { marginTop: 24, textAlign: 'center', fontSize: 16 },
});