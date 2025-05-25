import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../utils/config';

const ProfilePage = () => {
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

    //Function to logout user and return them to login page
    const handleLogout = async () => {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await AsyncStorage.removeItem('token'); //code to remove the token
                navigation.navigate('Login')//code to return the user to login screen so they can relog in

                const token = await AsyncStorage.getItem('token');
                console.log("Token = ", token); //null if logout is implemented correctly

              } catch (error) {
                console.error('Logout Error!:',error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    };


      return (
        <View style={styles.container}>
          
          <Text style={styles.title}>Profile</Text>
          <Image source={require('../assets/profile-pic.png')} style={styles.logo} />
          <Text style={styles.username}>{fullName}</Text>
          
          
          {/* Logout Button for Profile Page, deletes the Token and returns user to Login page so they can sign in again*/}
          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#000000', 
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 30,
      },
    
      title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#f9df7b',
        textAlign: 'center',
        marginBottom: 20,
      },

      username: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 0,
        color: '#f9df7b',
        letterSpacing: 1,
      },
    

      logo: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#f9df7b',
        marginBottom: 20,
        resizeMode: 'cover',
        backgroundColor: '#2E2E2E',
      },

      logout: {
        backgroundColor: '#D32F2F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 40,
      },

      logoutText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },

      profileContent: {
      alignItems: 'center',
      marginTop: 100,
    },

});

export default ProfilePage;
