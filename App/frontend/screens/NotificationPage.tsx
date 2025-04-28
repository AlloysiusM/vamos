import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
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

        const response = await fetch(`${API_URL}/api/user/getFriendReq`, {
          
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
        } 
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching profile. Check your network connection and API server.');
      }
      finally {
        setIsLoading(false); // Stop loading regardless of outcome
     }
    };

    fetchNotif();
  }, [])
);

const renderNotificationItem = ({ item }: { item: any }) => (
  <View style={styles.notificationItem}>
    <Text style={styles.notificationText}>{item.senderId || 'Unknown User'} sent you a friend request.</Text>
  </View>
);

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Notifications</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#B88A4E" />
      ) : users.length === 0 ? (
        <Text style={styles.noNotificationsText}>No notifications available.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
        />
      )}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 20,
        paddingTop: 60,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#B88A4E',
        letterSpacing: 1,
        textAlign: 'center',
      },
    
      notificationItem: {
        backgroundColor: '#2E2E2E',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
      },
      notificationText: {
        color: '#FFF',
        fontSize: 16,
      },

      noNotificationsText: {
        marginTop: 20,
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
      },
      listContent: {
        paddingBottom: 20,
      },
      
});

export default NotificationsPage;