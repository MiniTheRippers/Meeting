import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function VerifyScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // รับเฉพาะตัวเลข
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const otpValue = otp.join('');
      // เปลี่ยน URL ให้ตรงกับ backend ของคุณ
      const res = await axios.post('http://192.168.1.33:8000/api/v1/users/verify', { otp: otpValue });
      Alert.alert('ยืนยันสำเร็จ', 'บัญชีของคุณได้รับการยืนยันแล้ว');
      router.push('/home');
    } catch (error: any) {
      Alert.alert('ผิดพลาด', error.response?.data?.message || 'OTP ไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post('http://192.168.1.33:8000/api/v1/users/resend-otp');
      Alert.alert('ส่ง OTP ใหม่แล้ว', 'กรุณาตรวจสอบอีเมลของคุณ');
    } catch (error: any) {
      Alert.alert('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถส่ง OTP ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>กรอก OTP เพื่อยืนยันบัญชีของคุณ</Text>
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={ref => { inputRefs.current[index] = ref; }}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={value => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
            textAlign="center"
          />
        ))}
      </View>
      {!loading ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ea580c' }]} onPress={handleResendOtp}>
            <Text style={styles.buttonText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  otpInput: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#e5e7eb', fontSize: 28, fontWeight: 'bold', marginHorizontal: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, marginHorizontal: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});