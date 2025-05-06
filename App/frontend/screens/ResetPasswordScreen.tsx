import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { BASE_URL } from '../utils/config';

const ResetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();

    const route = useRoute();
    const { email } = route.params as { email: string };
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
  
    // Check submission form
    const handleForgot = async () => {
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields');
        console.log('[DEBUG] Missing fields:', { newPassword,confirmPassword });
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Your password does not match');
        return;
      }
    
      const requestBody = JSON.stringify({ email: email, newPassword });
      console.log('[DEBUG] Sending request:', requestBody);
    
      try {
        const response = await fetch(`${BASE_URL}/api/user/resetPassword`, {
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
          setError(data.message || 'Reset password failed');
          console.log('[DEBUG] Error Response:', data);
          return;
        }
        Alert.alert("Success", "Your new password is updated");
        navigation.navigate('Login');
        
      } catch (error) {
        console.log('[DEBUG] Fetch Error:', error);
        setError('Something went wrong. Please try again');
      }
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Please enter your new password</Text>
        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry
          placeholderTextColor="#C9D3DB"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
      </View>

      <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Please re-enter your new password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#C9D3DB"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>


      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleForgot}>
        <Text style={styles.buttonText}>Submit</Text>
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
