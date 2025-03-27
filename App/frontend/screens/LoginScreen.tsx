import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Google Auth Imports
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "509264945237-b46pi68ojbnhr87ucss680u9du0h2mt7.apps.googleusercontent.com",
    androidClientId: "509264945237-vh6t78o6ico6e52mn5cutuq8b27rsfji.apps.googleusercontent.com",
    webClientId: "509264945237-1ghnuup9jhemcug74knqmrvravjdst08.apps.googleusercontent.com",
    redirectUri: "http://localhost:8081",
  });

  // debug logs for web uri
  console.log('[DEBUG] Google Auth Request:', request);
  console.log('[DEBUG] Google Auth Response:', response);
  console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

  useEffect(() => {
    console.log('[DEBUG] Google Auth Response:', response);
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      } else {
        Alert.alert('Error', 'Failed to authenticate. No access token received.');
      }
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Authentication was canceled or failed.');
    }
  }, [response]);

  async function fetchUserInfo(token: string) {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();

      console.log('[DEBUG] Google User Info:', user);

      // Store user email locally
      await AsyncStorage.setItem('userEmail', user.email);
      Alert.alert('Success', `Welcome ${user.name}`);

      // Redirect user to App
      navigation.replace('AppTab');
    } catch (error) {
      console.error('[DEBUG] Google Auth Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      console.log('[DEBUG] Missing fields:', { email, password });
      return;
    }

    const requestBody = JSON.stringify({ email, password });
    console.log('[DEBUG] Sending request:', requestBody);

    try {
      const response = await fetch('http://localhost:5001/api/user/login', {
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

      // Store token in AsyncStorage (local phone storage)
      await AsyncStorage.setItem('token', data.token);
      console.log('[DEBUG] Token stored successfully');

      // get token for debugging
      const storedToken = await AsyncStorage.getItem('token');
      console.log('[DEBUG] Retrieved Token:', storedToken);

      navigation.replace('AppTab'); 
    } catch (error) {
      console.log('[DEBUG] Fetch Error:', error);
      setError('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      {/*Creating the image from our miro for the logo*/}
      <Image source={require('../assets/Vamos.jpg')} style={styles.logo} />
      
      <Text style={styles.title}>Sign in to Vamos</Text>

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

      {/* Forgot Button */}
      <TouchableOpacity style={styles.thirdButton} onPress={() => navigation.replace('ForgotPassword')}>
        <Text style={styles.thirdButtonText}>Forgot password</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Google Sign-In Button */}
      <TouchableOpacity 
        style={[styles.button, styles.googleButton]} 
        onPress={() => {
          console.log('[DEBUG] Prompting Google Auth...');
          promptAsync();
        }}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('Register')}>
        <Text style={styles.secondaryButtonText}>Go to Register</Text>
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

  googleButton: {
    backgroundColor: '#DB4437',
  },

  googleButtonText: {
    color: 'white',
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

  thirdButton: {
    marginTop: 0,
    paddingVertical: 12,
    //alignSelf: 'flex-end',
    //marginRight: 20,
  },

  thirdButtonText: {
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
  
  //placement of the vamos logo, adjust this customize placement.
  logo: {
    width: 400,         
    height: 150,       
    //resizeMode: 'contain',
    marginTop: 40,      
    marginBottom: 20,   
    //alignSelf: 'center',
  },
});


export default LoginScreen;
