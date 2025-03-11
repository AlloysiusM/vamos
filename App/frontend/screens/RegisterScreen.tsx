import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Register'>>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Registration failed');
        return;
      }
  
      const data = await response.json();
      setError('');
      console.log('User registered:', data);
      // Navigate to another screen if needed
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register to Vamos</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput style={styles.input} placeholder="FullName" placeholderTextColor="#C9D3DB" 
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#C9D3DB"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#C9D3DB"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={() => console.log('Register Pressed')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back to Login Button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.secondaryButtonText}>Back to Login</Text>
      </TouchableOpacity>
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
});

export default RegisterScreen;
