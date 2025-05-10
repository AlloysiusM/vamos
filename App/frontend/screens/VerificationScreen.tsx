import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BASE_URL } from '../utils/config';
import { LinearGradient } from 'expo-linear-gradient';

const VerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async () => {
    if (!code) {
      setError('Please fill in the code');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/verify-Email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Verification failed');
        return;
      }

      Alert.alert('Success', 'Code verified. Proceed to reset your password.');
      navigation.navigate('ResetPassword', { email });

    } catch (err) {
      console.error('[DEBUG] Verification Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <Image source={require('../assets/Vamos.jpg')} style={styles.logo} />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>A verification code has been sent to:</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            placeholderTextColor="#BDB298"
            keyboardType="number-pad"
            value={code}
            onChangeText={(text) => setCode(text)}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleForgot}>
          <LinearGradient
            colors={['#b57e10', '#f9df7b', '#f9df7b', '#b57e10']}
            style={styles.verifyButton}
          >
            <Text style={styles.verifyButtonText}>Verify Code</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: '90%',
    backgroundColor: '#0C0C0C',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f9df7b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#BDB298',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5F5DC',
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#444',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    borderColor: '#666',
    borderWidth: 1,
  },
  verifyButton: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f9df7b',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VerificationScreen;
