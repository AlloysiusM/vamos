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
      console.log('[DEBUG] Missing fields:', { fullName, email, password });
      return;
    }
    
    // Convert request to json
    const requestBody = JSON.stringify({ fullName, email, password });
    console.log('[DEBUG] Sending request:', requestBody);
    
    // Post data to db
    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
  
      console.log('[DEBUG] Response Status:', response.status);
      
      // await json response
      const data = await response.json();
      console.log('[DEBUG] Response Data:', data);
  
      if (response.status === 400) {
        setError(data.message || 'Invalid request. Please check your details.');
        return;
      }

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        console.log('[DEBUG] Error Response:', data);
        return;
      }
  
      setError('');
      console.log('[DEBUG] User registered successfully:', data);
      
      navigation.replace('Login');
    } catch (error) {
      console.log('[DEBUG] Fetch Error:', error);
      setError('Registration failed. Please try again.');
    }
  };  

  return (
    <View style={styles.container}>
      {/*Creating the image from our miro for the logo*/}
      <Image source={require('../assets/Vamos.jpg')} style={styles.logo} />
      
      <Text style={styles.title}>Register to Vamos</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Full Name" 
          placeholderTextColor="#C9D3DB"
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <LinearGradient
          colors={['#b57e10', '#f9df7b', '#f9df7b', '#b57e10', '#b57e10' ]} //custom gradient for our gold
            style={styles.button}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
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
    color: '#C9D3DB', 
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
     
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
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
    color: '#C9D3DB', 
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

export default RegisterScreen;
