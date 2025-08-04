import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async () => {
    if (formData.password !== formData.passwordConfirm) {
      Alert.alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.33:8000/api/v1/users/signup', formData);
      Alert.alert('สมัครสมาชิกสำเร็จ', 'กรุณาตรวจสอบอีเมลของคุณ');
      setTimeout(() => {
        router.push('../login');
      }, 1500);
    } catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || JSON.stringify(error.response.data));
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please check your API server.');
      } else {
        Alert.alert('Error', error.message);
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
          placeholder="Username"
          value={formData.username}
          onChangeText={v => handleChange('username', v)}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={formData.passwordConfirm}
          onChangeText={v => handleChange('passwordConfirm', v)}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already have account?{' '}
          <Text
            style={{ color: '#2563eb', fontWeight: 'bold' }}
            onPress={() => router.push('../login')}
          >
            Login
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
  loginText: { marginTop: 24, textAlign: 'center', fontSize: 16 },
});