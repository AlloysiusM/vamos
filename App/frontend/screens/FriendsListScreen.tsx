import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useFocusEffect
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useCallback } from "react"; // Import useCallback
import { TouchableOpacity, View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Platform, Dimensions } from "react-native"; // Import FlatList, ActivityIndicator, Alert
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
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  //Searching friends
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredFriends(friends);
    } else {
      setFilteredFriends(
        friends.filter((friends) =>
          friends.fullName?.toLowerCase().includes(query.toLowerCase()) // Filter events based on title
        )
      );
    }
  };
  

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
          <TouchableOpacity style={styles.messageButton}
            onPress={() => console.log('message')}>
          <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.removeButton, isAccepting === item._id && styles.buttonDisabled]}
            onPress={() => console.log('deleted')}
            disabled={isAccepting === item._id}>
          <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
      </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Friends</Text> {/* Changed title slightly */}
        
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={18} color="#C9D3DB" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search for your friends"
            placeholderTextColor="#C9D3DB"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {isLoading ? (
        <ActivityIndicator size="large" color="#B88A4E" />
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item._id}
          renderItem={renderFriendItem}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          contentContainerStyle={[
            styles.flatListContentStyle,
            Platform.OS === 'web' ? { maxHeight: Dimensions.get('window').height - 200, overflow: 'hidden' } : null,
          ]}
        />
      )}
        
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


const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C", // slightly lighter than background
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#444", // subtle border
  },

  searchIcon: {
    marginRight: 8,
    color: "#cccccc",  
  },

  input: {
    flex: 1,
  fontSize: 15,
  color: "#FFFFFF",
  paddingVertical: 0,
  paddingHorizontal: 0,
  },

  flatListContentStyle: {
    paddingBottom: 120,
  },

  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    // Remove paddingHorizontal/Vertical here, apply to specific sections if needed
    // Remove justifyContent center and marginTop -160
  },
  headerRow: {
    paddingHorizontal: 20,
  paddingTop: 60,
  paddingBottom: 10,
  backgroundColor: "#1E1E1E",
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

  messageButtonText:{
    color: "#1E1E1E",
    fontWeight: "bold",
      fontSize: 16,
  },

  messageButton: { 
    backgroundColor: "#B88A4E",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.45, // Assign portion of width
    alignItems: 'center',
    justifyContent: 'center', // Center activity indicator
    minHeight: 40, // Ensure minimum height for indicator
    marginRight: 10,
  },

  removeButton: { 
  backgroundColor: "#ca2729",
      paddingVertical: 10,
    //   paddingHorizontal: 20, // Use flex instead
      borderRadius: 8,
      flex: 0.45, // Assign portion of width
      // marginLeft: 10, // Remove margin if using flex
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
  },

  removeButtonText: { 
    color: "#1E1E1E",
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonDisabled: { // Style for disabled buttons
    opacity: 0.6,
},
});

export default FriendsList;