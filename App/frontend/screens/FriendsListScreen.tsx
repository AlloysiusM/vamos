import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useCallback, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  Dimensions,
  Keyboard
} from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Define the shape of a friend object
interface Friend {
  _id: string;
  fullName: string;
  email?: string;
}

const FriendsList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'FriendsList'>>();

  // State hooks
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingFriendId, setProcessingFriendId] = useState<string | null>(null);

  // Fetch the list of friends from the server
  const fetchFriends = useCallback(async () => {
    console.log('Fetching friends list...');
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please log in.');
        navigation.navigate('Login');
        setIsLoading(false);
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
  }, [navigation]);

  // Remove friend handler
  const handleRemoveFriend = async (friendId: string) => {
    if (processingFriendId) return;

    const showAlert = async () => {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm("Are you sure to remove");
        if (!confirmed) {
          console.log("Cancel Pressed");
          return;
        }
      } else {
        return Alert.alert(
          "Confirm Removal",
          "Are you sure you want to remove this friend?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Remove",
              style: "destructive",
              onPress: () => performRemoval(friendId)
            }
          ]
        );
      }

      await performRemoval(friendId);
    };

    const performRemoval = async (id: string) => {
      console.log(`Attempting to remove friend: ${id}`);
      setProcessingFriendId(id);

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'Authentication error.');
          setProcessingFriendId(null);
          return;
        }

        const response = await fetch(`${API_URL}/api/user/friends/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log(`Friend ${id} removed successfully.`);
          Alert.alert('Success', 'Friend removed.');
          setFriends(prev => prev.filter(f => f._id !== id)); 
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.message || `Failed to remove friend. Status: ${response.status}`;
          Alert.alert('Error', errorMessage);
        }
      } catch (error: any) {
        console.error('Remove friend exception:', error);
        Alert.alert('Error', `An error occurred: ${error.message}`);
      } finally {
        setProcessingFriendId(null);
      }
    };

    await showAlert();
  };

  // Fetch friends list when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [fetchFriends])
  );

  // Update filtered list when either the query or the friends list changes
  useEffect(() => {
    if (isLoading) return;

    if (searchQuery === "") {
      setFilteredFriends(friends);
    } else {
      setFilteredFriends(
        friends.filter(friend =>
          friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, friends, isLoading]);

  // Handle search box input
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Navigate to AddFriend screen
  const navigateToAddFriend = () => {
    Keyboard.dismiss();
    navigation.navigate("AddFriend");
  };

  // Friend list renderer
  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.fullName}</Text>
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => Alert.alert('Message', `Messaging ${item.fullName} (Not Implemented)`)}
      >
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.removeButton,
          processingFriendId === item._id && styles.buttonDisabled
        ]}
        onPress={() => handleRemoveFriend(item._id)}
        disabled={!!processingFriendId}
      >
        {processingFriendId === item._id ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.removeButtonText}>Remove</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Main view
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#B88A4E" style={styles.loader} />;
    }

    if (!isLoading && friends.length === 0) {
      return (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            You haven't added any friends yet. Tap the '+' icon above to add some!
          </Text>
        </View>
      );
    }

    if (searchQuery !== "" && filteredFriends.length === 0) {
      return <Text style={styles.noResultsText}>No friends found matching "{searchQuery}".</Text>;
    }

    // List of friends
    return (
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item._id}
        renderItem={renderFriendItem}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS === 'web' ? { maxHeight: Dimensions.get('window').height - 200 } : null,
        ]}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => {
          // Fallback
          if (!isLoading && searchQuery === "") {
            return <Text style={styles.noResultsText}>No friends to display.</Text>;
          }
          return null;
        }}
      />
    );
  };

  return (
      <View style={styles.container}>
          <View style={styles.headerArea}>
              <View style={styles.titleContainer}>
                   {navigation.canGoBack() && (
                      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                          <Ionicons name="arrow-back" size={28} color="#f9df7b" />
                      </TouchableOpacity>
                  )}
                  <Text style={styles.title}>Friends</Text>
                  
                  {/* Add Friend Button */}
                  <TouchableOpacity
                      onPress={navigateToAddFriend}
                      style={styles.addButtonIcon}
                  >
                      <Ionicons name="person-add-outline" size={28} color="#f9df7b" />
                  </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                  <Ionicons name="search" size={18} color="#cccccc" style={styles.searchIcon} />

                  {/* Search Input */}
                  <TextInput
                      style={styles.input}
                      placeholder="Search your friends..."
                      placeholderTextColor="#C9D3DB"
                      value={searchQuery}
                      onChangeText={handleSearchChange}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="search" 
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerArea: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
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
    fontWeight: 'bold',
    color: '#f9df7b',
    textAlign: 'center',
  },
  addButtonIcon: {
    position: 'absolute',
    right: -10,
    top: 0,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#f9df7b',
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
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  friendItem: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
  },
  friendInfo: {
    flex: 1,
    marginRight: 10,
  },
  friendName: {
    color: '#f9df7b',
    fontSize: 17,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#f9df7b',
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
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#cc3333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 38,
    minWidth: 80,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#666',
  },
});


export default FriendsList;