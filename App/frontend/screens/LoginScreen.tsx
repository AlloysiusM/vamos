import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_REDIRECT_URI, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';
import { BASE_URL } from '../utils/config'; 
import { LinearGradient } from 'expo-linear-gradient';

// Google Auth Imports
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectUri = AuthSession.makeRedirectUri({});

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
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
      return;
    }

    const requestBody = JSON.stringify({ email, password });

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      navigation.replace('AppTab'); 
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        {/* Bigger Vamos logo */}
        <Image source={require('../assets/Vamos2.jpg')} style={styles.logo} />
        
        <Text style={styles.welcomeText}>Sign in to Vamos</Text>

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

        {/* Forgot Password */}
        <TouchableOpacity 
          style={styles.forgotPasswordContainer} 
          onPress={() => navigation.replace('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button - Using original gradient */}
        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={['#b57e10', '#f9df7b', '#f9df7b', '#b57e10', '#b57e10']}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Or continue with */}
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Buttons */}

        {/* google login */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Text style={styles.socialButtonText}>G</Text>
          </TouchableOpacity>
          
          {/* Apple login placeholder */}
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}></Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Not a member? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={styles.registerLinkText}>Register now</Text>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#f9df7b', 
    fontSize: 14,
  },
  loginButton: {
    width: 280,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#1E1E1E', 
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#f9df7b', 
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f9df7b', 
  },
  socialButtonText: {
    fontSize: 20,
    color: '#f9df7b', 
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#BDB298', 
    fontSize: 14,
  },
  registerLinkText: {
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

export default LoginScreen;