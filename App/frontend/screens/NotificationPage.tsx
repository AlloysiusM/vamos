import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Make sure this path is correct
import React, { useCallback, useState } from 'react'; // Import React
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Make sure @env is set up correctly
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '../utils/config';

interface NotificationItem {
    _id: string;
    user: string; // recipient ID
    sender: { // Populated sender object
        _id: string;
        fullName: string;
        email: string; // Included from populate
    };
    message: string;
    type: string;
    createdAt: string; // Date will likely be a string from JSON
}


const NotificationsPage = () => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Notifications'>>();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null); // Track which notification is being accepted

    const fetchNotifications = useCallback(async () => { // Renamed for clarity
        console.log('Fetching notifications...');
        setIsLoading(true); // Start loading
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('No token found.');
                Alert.alert('Error', 'You are not logged in. Please log in again.');
                navigation.navigate('Login'); // Redirect to login if no token
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${BASE_URL}/api/user/getFriendReq`, {

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
                   if (response.status !== 200 || data?.message) { // Alert only on actual errors
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
    }, [navigation]); // Add navigation to dependency array

    useFocusEffect(
        useCallback(() => {
            fetchNotifications(); 
            return () => {
                setIsAccepting(null); 
            };
        }, [fetchNotifications]) 
    );

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
                     notificationId: notificationId, // Send notification ID
                 }),
            });

            
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Friend request accepted!');
                // Remove the notification from the list visually
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
            setIsAccepting(null); // Stop loading indicator for this item
        }
    };

    const handleReject = async (notificationId: string) => { // Make reject async too if it calls an API
        console.log('Rejecting notification:', notificationId);
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification._id !== notificationId)
                 );
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification._id !== notificationId)
        );

    };

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
            style={[styles.acceptButton, isAccepting === item._id && styles.buttonDisabled]} // Style update
            onPress={() => handleAccept(item._id, item.sender._id)} // Pass necessary IDs
            disabled={isAccepting === item._id} 
          >
            {isAccepting === item._id ? (
                <ActivityIndicator size="small" color="#1E1E1E" />
            ) : (
                <Text style={styles.acceptButtonText}>Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rejectButton, isAccepting === item._id && styles.buttonDisabled]} // Disable reject too
            onPress={() => handleReject(item._id)}
            disabled={isAccepting === item._id} // Disable if accept is in progress
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
        </View> // Changed back to View if FlatList handles scrolling
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 20,
        paddingTop: 60, // Adjust as needed for status bar/header
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#B88A4E',
        letterSpacing: 1,
        textAlign: 'center',
    },
    loader: {
        marginTop: 50,
    },
    notificationItem: {
        backgroundColor: '#2E2E2E',
        padding: 20,
        borderRadius: 8,
        marginBottom: 15, // Increased spacing
        borderWidth: 1,
        borderColor: '#444',
    },
    notificationText: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center', // Center the text
        marginBottom: 15, // Add space below text
    },
    senderName: {
       fontWeight: 'bold',
       color: '#E0E0E0',
    },
    noNotificationsText: {
        marginTop: 50,
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around', // Changed to space-around
      marginTop: 10, // Reduced top margin
    },
    acceptButton: { // Renamed from addButton
      backgroundColor: "#B88A4E",
      paddingVertical: 10,
      borderRadius: 8,
      flex: 0.45, // Assign portion of width
      alignItems: 'center',
      justifyContent: 'center', // Center activity indicator
      minHeight: 40, // Ensure minimum height for indicator
    },
    acceptButtonText: { // Renamed from addButtonText
      color: "#1E1E1E",
      fontWeight: "bold",
      fontSize: 16,
    },
    rejectButton: {
      backgroundColor: "#555",
      paddingVertical: 10,
    //   paddingHorizontal: 20, // Use flex instead
      borderRadius: 8,
      flex: 0.45, // Assign portion of width
      // marginLeft: 10, // Remove margin if using flex
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    rejectButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 16,
    },
     buttonDisabled: { // Style for disabled buttons
        opacity: 0.6,
    },
});

export default NotificationsPage;