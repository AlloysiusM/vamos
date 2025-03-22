import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';


const VerificationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();

    const route = useRoute();
    const { email } = route.params as { email: string };
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
  
    // Check submission form
    const handleForgot = async () => {
      if (!code) {
        setError('Please fill in all fields');
        console.log('[DEBUG] Missing fields:', { code });
        return;
      }
    
      const requestBody = JSON.stringify({ email, code });
      console.log('[DEBUG] Sending request:', requestBody);
    
      try {
        const response = await fetch('http://localhost:5001/api/user/verify-Email', {
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
          setError(data.message || 'Error sending reset code');
          console.log('[DEBUG] Error Response:', data);
          return;
        }
        Alert.alert("Success", "Check your email for reset instructions");
        navigation.navigate('ResetPassword', { email });
        
      } catch (error) {
        console.log('[DEBUG] Fetch Error:', error);
        setError('Something went wrong. Please try again');
      }
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The verify code has been sent to your email</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Please enter verify Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Code"
          keyboardType="number-pad"
          placeholderTextColor="#C9D3DB"
          value={code}
          onChangeText={(text) => setCode(text)}
        />
      </View>


      {/* submit Button */}
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


export default VerificationScreen;
