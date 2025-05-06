import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/config'; // Adjust the import path as necessary
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Check submission form
  const handleForgot = async () => {
    if (!email) {
      setError('Please fill in all fields');
      console.log('[DEBUG] Missing fields:', { email });
      return;
    }

    const requestBody = JSON.stringify({ email });
    console.log('[DEBUG] Sending request:', requestBody);

    try {
      const response = await fetch(`${BASE_URL}/api/user/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      console.log('[DEBUG] Response Status:', response.status);

      const data = await response.json();
      console.log('[DEBUG] Response Data:', data);

      if (!response.ok) {
        setError(data.message || 'Login failed');
        console.log('[DEBUG] Error Response:', data);
        return;
      }
      Alert.alert("Success", "Check your email for reset instructions");
      navigation.navigate('VerificationEmail', { email });
    } catch (error) {
      console.log('[DEBUG] Fetch Error:', error);
      setError('Something went wrong. Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Please enter your email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#BDB298"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      {/* Next Button - Using original gradient */}
      <TouchableOpacity onPress={handleForgot}>
        <LinearGradient
          colors={['#b57e10', '#f9df7b', '#f9df7b', '#b57e10', '#b57e10']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#f9df7b',
    letterSpacing: 1,
  },

  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BDB298',
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
    color: '#f9df7b',
    borderWidth: 1,
    borderColor: '#333',
  },

  button: {
    width: 250,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    marginTop: 20,
  },

  secondaryButtonText: {
    color: '#f9df7b',
    fontSize: 14,
    fontWeight: '600',
  },

  errorText: {
    color: '#FF6B6B',
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
