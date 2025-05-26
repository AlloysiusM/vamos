import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Import useFocusEffect
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useCallback, useEffect } from "react"; // Import useCallback
import { TouchableOpacity, View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput, Platform, Dimensions, Keyboard } from "react-native"; // Import FlatList, ActivityIndicator, Alert
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { API_URL } from '@env'; // Import API_URL
import { BASE_URL } from "../utils/config";

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
  const [friends, setFriends] = useState<Friend[]>([]); // Full list from API
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]); // List to display (filtered or full)
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [searchQuery, setSearchQuery] = useState('');
  const [processingFriendId, setProcessingFriendId] = useState<string | null>(null); // Track removal process

  // --- API Calls ---

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
      console.log('Fetching friends list...');
      setIsLoading(true);
      try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
              Alert.alert('Error', 'Not authenticated. Please log in.');
              navigation.navigate('Login');
               setIsLoading(false); // Ensure loading stops if we exit early
              return;
          }

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
                  console.log('Friends data received:', data.length);
                  setFriends(data); // *** Set the main friends list ***
                  // Let the useEffect handle setting filteredFriends based on this new 'friends' state and current 'searchQuery'
              } else {
                  console.error('Received non-array data for friends:', data);
                  Alert.alert('Error', 'Invalid data format received from server.');
                  setFriends([]); // Reset on format error
              }
          } else {
              const errorMessage = data?.message || `HTTP error! status: ${response.status}`;
              console.error('Fetch friends error:', errorMessage);
              Alert.alert('Error', `Failed to fetch friends: ${errorMessage}`);
              setFriends([]); // Reset on fetch error
          }
      } catch (error: any) {
          console.error('Fetch friends exception:', error);
          Alert.alert('Error', `An error occurred while fetching friends: ${error.message}`);
          setFriends([]); // Reset on exception
      } finally {
          setIsLoading(false);
      }
      // *** Remove searchQuery from dependencies: fetch doesn't need to rerun on query change ***
  }, [navigation]);

  // Remove a friend
  const handleRemoveFriend = async (friendId: string) => {
    
      if (processingFriendId) return; // Prevent concurrent removals
      console.log('gg');
      const showAlert = async() => {
        if (Platform.OS === 'web') {
          const confirmed = window.confirm("Are you sure to remove"); // confirm has OK and Cancel
          if (confirmed) {
            
            console.log(`Attempting to remove friend: ${friendId}`);
            setProcessingFriendId(friendId);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'Authentication error.');
                    setProcessingFriendId(null);
                    return;
                }

                const response = await fetch(`${BASE_URL}/api/user/friends/${friendId}`, {

                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    console.log(`Friend ${friendId} removed successfully.`);
                    Alert.alert('Success', 'Friend removed.');
                    // *** Update only the main 'friends' list ***
                    setFriends(prevFriends => prevFriends.filter(f => f._id !== friendId));
                    // The useEffect hook will automatically update 'filteredFriends'
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData?.message || `Failed to remove friend. Status: ${response.status}`;
                    console.error('Remove friend error:', errorMessage);
                    Alert.alert('Error', errorMessage);
                }
            } catch (error: any) {
                console.error('Remove friend exception:', error);
                Alert.alert('Error', `An error occurred: ${error.message}`);
            } finally {
                setProcessingFriendId(null);
            }
          } else {
            console.log("Cancel Pressed");
          }
        } else {
          Alert.alert(
            "Confirm Removal",
            "Are you sure you want to remove this friend?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove", style: "destructive", onPress: async () => {
                        console.log(`Attempting to remove friend: ${friendId}`);
                        setProcessingFriendId(friendId);
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (!token) {
                                Alert.alert('Error', 'Authentication error.');
                                setProcessingFriendId(null);
                                return;
                            }
  
                            const response = await fetch(`${API_URL}/api/user/friends/${friendId}`, {
  
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
  
                            if (response.ok) {
                                console.log(`Friend ${friendId} removed successfully.`);
                                Alert.alert('Success', 'Friend removed.');
                                // *** Update only the main 'friends' list ***
                                setFriends(prevFriends => prevFriends.filter(f => f._id !== friendId));
                                // The useEffect hook will automatically update 'filteredFriends'
                            } else {
                                const errorData = await response.json().catch(() => ({}));
                                const errorMessage = errorData?.message || `Failed to remove friend. Status: ${response.status}`;
                                console.error('Remove friend error:', errorMessage);
                                Alert.alert('Error', errorMessage);
                            }
                        } catch (error: any) {
                            console.error('Remove friend exception:', error);
                            Alert.alert('Error', `An error occurred: ${error.message}`);
                        } finally {
                            setProcessingFriendId(null);
                        }
                    }
                }
            ]
        );
        }
      };

      await showAlert()
      
  };



  // Fetch friends when the screen comes into focus
  useFocusEffect(
      useCallback(() => {
          // Reset search query when screen gets focus (optional, keeps things clean)
          // setSearchQuery('');
          fetchFriends(); // Call the stable fetchFriends function
          return () => {
              // Optional cleanup when screen loses focus
          };
      }, [fetchFriends]) // Now depends on the stable fetchFriends reference
  );

  // Update filtered friends list when search query or the main friends list changes
  useEffect(() => {
      // Don't run filter logic while the initial fetch is happening
      if (isLoading) return;

      if (searchQuery === "") {
          setFilteredFriends(friends); // Show all friends
      } else {
          setFilteredFriends(
              friends.filter((friend) =>
                  friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
              )
          );
      }
      // This effect runs whenever the source list (friends) or the filter criteria (searchQuery) changes
      // or when loading completes (to set the initial filtered list)
  }, [searchQuery, friends, isLoading]);


  // --- Event Handlers ---
  const handleSearchChange = (query: string) => {
      setSearchQuery(query);
  };

  const navigateToAddFriend = () => {
      Keyboard.dismiss();
      navigation.navigate("AddFriend");
  };



  // Render item for the FlatList
  const renderFriendItem = ({ item }: { item: Friend }) => (
      <View style={styles.friendItem}>
          <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{item.fullName}</Text>
          </View>
          <TouchableOpacity
              style={styles.messageButton}
              onPress={(log) => {console.log('click');
              }}
          >
              <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.removeButton, processingFriendId === item._id && styles.buttonDisabled]}
              onPress={() => handleRemoveFriend(item._id)}
              disabled={!!processingFriendId} // Disable all remove buttons during any removal
          >
              {processingFriendId === item._id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                  <Text style={styles.removeButtonText}>Remove</Text>
              )}
          </TouchableOpacity>
      </View>
  );

  // Determine what content to show in the main area
  const renderContent = () => {
      if (isLoading) {
          return <ActivityIndicator size="large" color="#B88A4E" style={styles.loader} />;
      }

      // No friends added *at all*
      if (!isLoading && friends.length === 0) {
           return (
              <View style={styles.promptContainer}>
                  <Text style={styles.promptText}>
                      You haven't added any friends yet. Tap the '+' icon above to add some!
                  </Text>
              </View>
          );
      }

      // Searched, but no results found
      if (searchQuery !== "" && filteredFriends.length === 0) {
          return <Text style={styles.noResultsText}>No friends found matching "{searchQuery}".</Text>;
      }

      // Display the list (either full or filtered)
      // Note: If friends.length > 0 and searchQuery is "" and filteredFriends.length is 0,
      // this indicates an issue in the useEffect logic, but it should work correctly.
      return (
          <FlatList
              data={filteredFriends} // Always render based on the filtered list
              keyExtractor={(item) => item._id}
              renderItem={renderFriendItem}
              showsVerticalScrollIndicator={Platform.OS !== 'web'}
              contentContainerStyle={[
                  styles.listContainer,
                  // *** Use overflowY for web scroll ***
                  Platform.OS === 'web' ? { maxHeight: Dimensions.get('window').height - 200, overflowY: 'auto' } : null,
              ]}
              keyboardShouldPersistTaps="handled" // Good for dismissing keyboard on tap
              ListEmptyComponent={() => {
                   // This should ideally not be reached if the logic above is correct,
                   // but can be a fallback. The prompts above are more specific.
                   if (!isLoading && searchQuery === "") { // Only show if not searching and list is empty (after initial load)
                       return (
                          <View style={styles.promptContainer}>
                               <Text style={styles.promptText}>No friends to display.</Text>
                           </View>
                       )
                   }
                   return null; // Don't show empty component if loading or searching with no results (handled above)
               }}
          />
      );
  };

  return (
      <View style={styles.container}>
          {/* Header Area */}
          <View style={styles.headerArea}>
              <View style={styles.titleContainer}>
                   {navigation.canGoBack() && (
                      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                          <Ionicons name="arrow-back" size={28} color="#f9df7b" />
                      </TouchableOpacity>
                  )}
                  <Text style={styles.title}>Friends</Text>
                  <TouchableOpacity
                      onPress={navigateToAddFriend}
                      style={styles.addButtonIcon}
                  >
                      <Ionicons name="person-add-outline" size={28} color="#f9df7b" />
                  </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                  <Ionicons name="search" size={18} color="#cccccc" style={styles.searchIcon} />
                  <TextInput
                      style={styles.input}
                      placeholder="Search your friends..."
                      placeholderTextColor="#C9D3DB"
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="search" // Indicate search action on keyboard
                  />
                  {searchQuery.length > 0 && (
                       <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                           <Ionicons name="close-circle" size={20} color="#cccccc" />
                       </TouchableOpacity>
                  )}
              </View>
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
              {renderContent()}
          </View>
      </View>
  );
};

// --- Styles --- (Keep styles as they were)
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#1E1E1E",
  },
  headerArea: {
      paddingTop: Platform.OS === 'android' ? 40 : 60,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: "#1E1E1E",
      borderBottomWidth: 1,
      borderBottomColor: '#333',
  },
  titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: 15,
      minHeight: 40,
  },
  backButton: {
      position: 'absolute',
      left: -10,
      top: 0,
      padding: 10,
      zIndex: 1,
  },
  title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#B88A4E",
      textAlign: "center",
  },
  addButtonIcon: {
      position: 'absolute',
      right: -10,
      top: 0,
      padding: 10,
  },
  inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2C2C2C",
      borderRadius: 16,
      paddingHorizontal: 12,
      height: 42,
      borderWidth: 1,
      borderColor: "#444",
  },
  searchIcon: {
      marginRight: 8,
  },
  input: {
      flex: 1,
      fontSize: 15,
      color: "#FFFFFF",
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
      paddingHorizontal: 0,
  },
  clearButton: {
     paddingLeft: 8,
  },
  contentArea: {
      flex: 1,
  },
  loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
  },
  promptContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
  },
  promptText: {
      color: '#aaa',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 22,
  },
  noResultsText: {
      marginTop: 50,
      color: '#aaa',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
  },
  listContainer: {
      paddingTop: 15,
      paddingBottom: 30,
      paddingHorizontal: 20, // Apply padding here for list content
      flexGrow: 1, // Ensure container grows to allow centering of EmptyComponent
  },
  friendItem: {
      backgroundColor: '#2E2E2E',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#444',
  },
  friendInfo: {
      flex: 1,
      marginRight: 10,
  },
  friendName: {
      color: '#E0E0E0',
      fontSize: 17,
      fontWeight: 'bold',
  },
  messageButton: {
      backgroundColor: "#B88A4E",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 6,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 38,
      minWidth: 80,
  },
  messageButtonText: {
      color: "#1E1E1E",
      fontWeight: "bold",
      fontSize: 14,
  },
  removeButton: {
      backgroundColor: "#cc3333",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 38,
      minWidth: 80,
  },
  removeButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 14,
  },
  buttonDisabled: {
      opacity: 0.6,
      backgroundColor: '#666',
  },
});

export default FriendsList;