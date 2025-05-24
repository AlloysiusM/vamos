import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useCallback, useState } from 'react';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, } from '@react-navigation/native';
import { BASE_URL } from '../utils/config';

const ProfilePage = () => {
    //add page routs and other functions 

    const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Profile'>>();
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(true); 

    useFocusEffect(
      useCallback(() => {
        console.log('fafaf');
        
        
        const fetchUserName = async () => {
          setIsLoading(true); // Start loading
          try {
            const token = await AsyncStorage.getItem('token');
  
            if (!token) {
              console.log('dfd');
              
              // Handle case where user is not logged in (e.g., redirect to login)
              Alert.alert('Error', 'You are not logged in.');
              // Example: navigation.navigate('Login'); // Or your login screen name
              setIsLoading(false);
              return;
            }
  
            const response = await fetch(`${BASE_URL}/api/user/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              
              
            });
            
    
            const data = await response.json();
  
            console.log(data);
            
    
            if (response.ok) {
              
              setFullName(data.fullName);
            } else {
             // Handle specific errors (e.g., token expired -> redirect to login)
             if (response.status === 401) {
              Alert.alert('Session Expired', 'Please log in again.');
              // Optionally clear token and navigate to login
              await AsyncStorage.removeItem('token');
              // navigation.navigate('Login');
         } else {
              Alert.alert('Error', data.message || 'Could not load user profile');
         }
       }
          } catch (error) {
            console.error('Fetch user profile error:', error);
            Alert.alert('Error', 'Something went wrong while fetching profile. Check your network connection and API server.');
          }
          finally {
            setIsLoading(false); // Stop loading regardless of outcome
         }
        };
    
        fetchUserName();
      }, [])
    );


      return (
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <Image source={require('../assets/profile-pic.png')} style={styles.logo} />
          <Text style={styles.username}>{fullName}</Text>
           {/* Change Password */}
                  <TouchableOpacity 
                    style={styles.forgotPasswordContainer} 
                    onPress={() => navigation.replace('ForgotPassword')}
                  >
                    <Text style={styles.forgotPasswordText}>Change Password</Text>
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
        marginTop: -400,
        marginBottom: 60,
        color: '#B88A4E',
        letterSpacing: 1,
      },

      username: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
        color: '#B88A4E',
        letterSpacing: 1,
      },
    

      logo: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#B88A4E',
        marginBottom: 20,
        resizeMode: 'cover',
        backgroundColor: '#2E2E2E',
      },

      forgotPasswordContainer: {
    
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#f9df7b', 
    fontSize: 14,
  },
});

export default ProfilePage;