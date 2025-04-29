import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useFocusEffect
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useCallback } from "react"; // Import useCallback
import { TouchableOpacity, View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native"; // Import FlatList, ActivityIndicator, Alert
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { API_URL } from '@env'; // Import API_URL

// Define an interface for your Friend object based on your API response
interface Friend {
    _id: string;
    fullName: string;
    email?: string; // Optional email
    // Add other relevant fields like profile picture URL, etc.
}

const FriendsList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList,'FriendsList'>>();

  // State for friends list, loading, and errors
  const [friends, setFriends] = useState<Friend[]>([]); // Use the Friend interface
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch friends
  const fetchFriends = useCallback(async () => {
      console.log('Fetching friends list...');
      setIsLoading(true);
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              Alert.alert('Error', 'Not authenticated. Please log in.');
              navigation.navigate('Login'); // Redirect if no token
              setIsLoading(false);
              return;
          }

          // *** IMPORTANT: Replace with your actual backend endpoint for getting friends ***
          const response = await fetch(`${API_URL}/api/user/friends`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
          });

          const data = await response.json();

          if (response.ok) {
              if (Array.isArray(data)) {
                  console.log('Friends data received:', data);
                  setFriends(data);
              } else {
                  console.error('Received non-array data for friends:', data);
                  Alert.alert('Error', 'Invalid data format received from server.');
                  setFriends([]);
              }
          } else {
              const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
              console.error('Fetch friends error:', errorMessage);
              Alert.alert('Error', `Failed to fetch friends: ${errorMessage}`);
              setFriends([]);
          }
      } catch (error: any) {
          console.error('Fetch friends exception:', error);
          Alert.alert('Error', `An error occurred while fetching friends: ${error.message}`);
          setFriends([]);
      } finally {
          setIsLoading(false);
      }
  }, [navigation]); // Add navigation dependency

  // Use useFocusEffect to refetch friends when the screen comes into focus
  useFocusEffect(
      useCallback(() => {
          fetchFriends(); // Fetch friends when screen is focused

          return () => {
            // Optional cleanup if needed when screen loses focus
          };
      }, [fetchFriends]) // Depend on the stable fetchFriends function
  );

  // Render item for the FlatList
  const renderFriendItem = ({ item }: { item: Friend }) => (
      <View style={styles.friendItem}>
          {/* You might add an avatar/icon here later */}
          <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{item.fullName}</Text>
              {item.email && <Text style={styles.friendEmail}>{item.email}</Text>}
          </View>
          {/* Optional: Add a button to view profile or chat */}
          {/* <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#f9df7b" />
          </TouchableOpacity> */}
      </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Friends</Text> {/* Changed title slightly */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddFriend")}
          style={styles.addButtonIcon} // Renamed style for clarity
        >
          <Ionicons name="person-add-outline" size={28} color="#f9df7b" /> {/* Changed Icon */}
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {isLoading ? (
            <ActivityIndicator size="large" color="#B88A4E" style={styles.loader} />
        ) : friends.length === 0 ? (
            <Text style={styles.noFriendsText}>You haven't added any friends yet. Tap the '+' icon to add friends.</Text>
        ) : (
            <FlatList
                data={friends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
        )}
      </View>
    </View>
  );
};

// --- Styles Update ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    // Remove paddingHorizontal/Vertical here, apply to specific sections if needed
    // Remove justifyContent center and marginTop -160
  },
  headerRow: {
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Align items vertically
    justifyContent: 'center', // Center title horizontally
    paddingHorizontal: 20, // Add padding back here
    paddingTop: 60, // Adjust for status bar/notch
    paddingBottom: 20, // Space below header
    position: 'relative', // Needed for absolute positioning of the button
    width: '100%',
    backgroundColor: "#1E1E1E", // Ensure header background matches
    // Remove marginTop -520
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B88A4E",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 34,
    // No flex needed if centered like this
  },
  addButtonIcon: { // Renamed from addButton
    position: 'absolute', // Position relative to headerRow
    right: 15, // Adjust position
    top: 60,   // Adjust vertical position to align with title
    padding: 10, // Add padding for easier tapping
  },
  contentArea: {
    flex: 1, // Take remaining space
    paddingHorizontal: 20, // Padding for the list content
  },
  loader: {
      marginTop: 50,
      flex: 1, // Make loader take space if needed
      justifyContent: 'center',
      alignItems: 'center',
  },
  noFriendsText: {
      marginTop: 50,
      color: '#888',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20, // Add padding for better readability
  },
  listContainer: {
      paddingBottom: 20, // Space at the bottom of the list
  },
  friendItem: {
      backgroundColor: '#2E2E2E',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: 'row', // Layout items in a row
      alignItems: 'center', // Align items vertically
      justifyContent: 'space-between', // Space out info and action button
      borderWidth: 1,
      borderColor: '#444',
  },
  friendInfo: {
      flex: 1, // Allow info to take available space
      marginRight: 10, // Space before action button
  },
  friendName: {
      color: '#E0E0E0',
      fontSize: 17,
      fontWeight: 'bold',
  },
  friendEmail: {
      color: '#aaa',
      fontSize: 14,
      marginTop: 2,
  },
//   actionButton: { // Optional action button styling
//       padding: 5,
//   },
});

export default FriendsList;