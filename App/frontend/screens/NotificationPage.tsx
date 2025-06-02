import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthNavigator'; 
import React, { useCallback, useState } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { ScrollView } from 'react-native-gesture-handler';

// ts declaration
interface NotificationItem {
    _id: string;
    user: string; 
    sender: {
        _id: string;
        fullName: string;
        email: string; 
    };
    message: string;
    type: string;
    createdAt: string; 
}

const NotificationsPage = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Notifications'>>();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null); 

    const fetchNotifications = useCallback(async () => { 
        console.log('Fetching notifications...');
        setIsLoading(true); 
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('No token found.');
                Alert.alert('Error', 'You are not logged in. Please log in again.');
                navigation.navigate('Login');
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

            console.log('Received notifications data:', data);

            if (response.ok) {
                if (Array.isArray(data)) {
                   setNotifications(data);
                } else {
                   console.error("Received data is not an array:", data);
                   setNotifications([]);
                   if (response.status !== 200 || data?.message) {
                     Alert.alert('Error', 'Received invalid notification data format.');
                   }
                }
            } else {
                const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
                console.error('Fetch notifications error:', errorMessage);
                Alert.alert('Error', `Failed to fetch notifications: ${errorMessage}`);
                setNotifications([]);
            }
        } catch (error: any) {
            console.error('Fetch notifications exception:', error);
            Alert.alert('Error', `Something went wrong while fetching notifications. Check your network connection. Details: ${error.message}`);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications(); 
            return () => {
                setIsAccepting(null); 
            };
        }, [fetchNotifications]) 
    );

    // accepting a friend request
    const handleAccept = async (notificationId: string, senderId: string) => {
        setIsAccepting(notificationId); 
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please log in again.');
                setIsAccepting(null);
                return;
            }

            const response = await fetch(`${API_URL}/api/user/acceptFriendRequest`, {
                
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                     notificationId: notificationId,
                 }),
            });

            
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Friend request accepted!');
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification._id !== notificationId)
                );
            } else {
                const errorMessage = data?.message || `Failed to accept friend request (Status: ${response.status})`;
                console.error('Accept friend request error:', errorMessage);
                Alert.alert('Error', errorMessage);
            }
        } catch (error: any) {
            console.error('Accept friend request exception:', error);
            Alert.alert('Error', `An error occurred: ${error.message}`);
        } finally {
            setIsAccepting(null); 
        }
    };

    // rejecting a friend request
    const handleReject = async (notificationId: string) => { 
        console.log('Rejecting notification:', notificationId);
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification._id !== notificationId)
                 );
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification._id !== notificationId)
        );

    };

    // Notification item
    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
      <View style={styles.notificationItem}>
         {/* Display sender's name */}
        <Text style={styles.notificationText}>
          <Text style={styles.senderName}>
            {item.sender?.fullName || 'Unknown User'}
          </Text>
           {' '}wants to be your friend.
        </Text>

        {/* Button container */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.acceptButton, isAccepting === item._id && styles.buttonDisabled]} 
            onPress={() => handleAccept(item._id, item.sender._id)}
            disabled={isAccepting === item._id} 
          >
            {isAccepting === item._id ? (
                <ActivityIndicator size="small" color="#1E1E1E" />
            ) : (
                <Text style={styles.acceptButtonText}>Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectButton, isAccepting === item._id && styles.buttonDisabled]} 
            onPress={() => handleReject(item._id)}
            disabled={isAccepting === item._id} 
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#B88A4E" style={styles.loader} />
            ) : notifications.length === 0 ? (
                <Text style={styles.noNotificationsText}>No new friend requests.</Text>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderNotificationItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View> 
    );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f9df7b',
    textAlign: 'center',
    marginBottom: 20,
  },

  loader: {
    marginTop: 50,
  },

  noNotificationsText: {
    marginTop: 40,
    color: '#BDB298',
    fontSize: 14,
    textAlign: 'center',
  },

  listContent: {
    paddingBottom: 20,
  },

  notificationItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },

  notificationText: {
    color: '#BDB298',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },

  senderName: {
    fontWeight: 'bold',
    color: '#f9df7b',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  acceptButton: {
    backgroundColor: '#f9df7b',
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },

  rejectButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#555',
  },

  acceptButtonText: {
    color: '#1A1A1A',
    fontWeight: '600',
    fontSize: 14,
  },

  rejectButtonText: {
    color: '#BDB298',
    fontWeight: '600',
    fontSize: 14,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});

export default NotificationsPage;