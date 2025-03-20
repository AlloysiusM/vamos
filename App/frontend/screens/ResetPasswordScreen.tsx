import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPasswordScreen = () => {
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
        const response = await fetch('http://localhost:5001/api/user/forgotPassword', {
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
      } catch (error) {
        console.log('[DEBUG] Fetch Error:', error);
        setError('Something went wrong. Please try again');
      }
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password?</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Please enter your email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#C9D3DB"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>


      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleForgot}>
        <Text style={styles.buttonText}>Next</Text>
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
    backgroundColor: '#1E1E1E', 
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#B88A4E',
    letterSpacing: 1,
  },

  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C9D3DB', 
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#333', 
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
    color: '#C9D3DB', 
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    elevation: 3, 
  },

  button: {
    backgroundColor: '#B88A4E',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  buttonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '600',
  },

  secondaryButton: {
    marginTop: 20,
    paddingVertical: 12,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#B88A4E',
  },

  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },

});


export default ResetPasswordScreen;
