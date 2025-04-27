import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const NotificationsPage = () => {
    //add page routs and other functions 
const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Notifications'>>();

const [users, setUsers] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(true); 

useFocusEffect(
  useCallback(() => {
    console.log('fa');
    
    
    const fetchNotif = async () => {
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

        const response = await fetch(`${API_URL}/api/user/notif`, {
          
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          
        });

        const data = await response.json();

        console.log(data);

        

        if (response.ok) {
          
          setUsers(data);
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

    fetchNotif();
  }, [])
);

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Notifications</Text>
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
    
    
      
});

export default NotificationsPage;