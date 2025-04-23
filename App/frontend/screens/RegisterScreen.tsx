import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '@env';

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Register'>>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //check submission form
  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Convert request to json
    const requestBody = JSON.stringify({ fullName, email, password });
    
    // Post data to db
    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      // await json response
      const data = await response.json();
  
      if (response.status === 400) {
        setError(data.message || 'Invalid request. Please check your details.');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
  
      setError('');
      navigation.replace('Login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Vamos logo */}
        <Image source={require('../assets/Vamos.jpg')} style={styles.logo} />
        
        <Text style={styles.welcomeText}>Let's create an account for you</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#BDB298"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#BDB298"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#BDB298"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={['#b57e10', '#f9df7b', '#f9df7b', '#b57e10', '#b57e10']}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Already a member */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already a member? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.loginLinkText}>Login now</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#f9df7b',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#f9df7b',
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
  },
  signUpButton: {
    width: 280,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#BDB298',
    fontSize: 14,
  },
  loginLinkText: {
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

export default RegisterScreen;