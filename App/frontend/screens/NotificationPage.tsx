import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Make sure this path is correct
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Make sure @env is set up correctly
import { ScrollView } from 'react-native-gesture-handler';

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

    useFocusEffect(
        useCallback(() => {
            console.log('Fetching notifications...');

            const fetchNotif = async () => {
                setIsLoading(true); // Start loading
                try {
                    const token = await AsyncStorage.getItem('token');

                    if (!token) {
                        console.log('No token found.');
                        Alert.alert('Error', 'You are not logged in. Please log in again.');
                        setIsLoading(false);
                        return;
                    }

                    const response = await fetch(`${API_URL}/api/user/getFriendReq`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // Template literal corrected
                        },
                    });

                    const data = await response.json();

                    console.log('Received data:', data); // Log the received data structure

                    if (response.ok) {
                        if (Array.isArray(data)) {
                           setNotifications(data);
                        } else {
                           console.error("Received data is not an array:", data);
                           setNotifications([]); // Set to empty array if format is wrong
                           Alert.alert('Error', 'Received invalid notification data format.');
                        }
                    } else {
                        // Handle specific error messages from the backend if available
                        const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
                        console.error('Fetch notifications error:', errorMessage);
                        Alert.alert('Error', `Failed to fetch notifications: ${errorMessage}`);
                        setNotifications([]); // Clear notifications on error
                    }
                } catch (error: any) { // Catch block typed
                    console.error('Fetch notifications exception:', error);
                    Alert.alert('Error', `Something went wrong while fetching notifications. Check your network connection and API server. Details: ${error.message}`);
                    setNotifications([]); // Clear notifications on exception
                } finally {
                    setIsLoading(false); 
                }
            };

            fetchNotif();
        }, []) 
    );

    const handleReject = (id: string) => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );
    };

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
      <View style={styles.notificationItem}>
        <Text style={styles.senderName}>{item.message}</Text>
        <Text style={styles.notificationText}>
          <Text style={styles.senderName}>
            {item.sender?.fullName || 'Unknown User'} wants to be your friend
          </Text>
        </Text>
        {/* Button container */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={() => console.log('added')}>
            <Text style={styles.addButtonText}>Accept</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#B88A4E" style={styles.loader} />
            ) : notifications.length === 0 ? ( // Check renamed state variable
                <Text style={styles.noNotificationsText}>No notifications available.</Text>
            ) : (
                <FlatList
                    data={notifications} // Use renamed state variable
                    // Use item._id which should be unique from MongoDB
                    keyExtractor={(item) => item._id}
                    renderItem={renderNotificationItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        
        </ScrollView>
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
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#444', // Subtle border
    },
    notificationText: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 22, // Improve readability
    },
    senderName: {
       fontWeight: 'bold',
       color: '#E0E0E0', // Slightly different color for emphasis
       textAlign: 'center',
    },
    // Optional style for timestamp
    // notificationTime: {
    //   color: '#888',
    //   fontSize: 12,
    //   marginTop: 5,
    //   textAlign: 'right',
    // },
    noNotificationsText: {
        marginTop: 50, // More space when empty
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },

    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    
    addButton: {
      backgroundColor: "#B88A4E",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      marginRight: 10,
      alignItems: 'center',
    },
    
    addButtonText: {
      color: "#1E1E1E",
      fontWeight: "bold",
      fontSize: 16,
    },
    
    rejectButton: {
      backgroundColor: "#555", // Different color for Reject (grey)
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      marginLeft: 10,
      alignItems: 'center',
    },
    
    rejectButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 16,
    },
});

export default NotificationsPage;