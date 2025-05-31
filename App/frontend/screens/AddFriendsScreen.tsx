import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const AddFriendsScreen: React.FC = () => {

  // Ts declaration
  interface User {
    _id: string;
    fullName: string;
    email?: string;
  }

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'AddFriend'>>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingFriendId, setProcessingFriendId] = useState<string | null>(null);

  // Load users
  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Error", "You are not logged in.");
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${API_URL}/api/user/add-friends`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUsers(data);
            setFilteredUsers(data);
          } else {
            if (response.status === 401) {
              Alert.alert("Session Expired", "Please log in again.");
              await AsyncStorage.removeItem("token");
            } else {
              Alert.alert("Error", data.message || "Could not load users");
            }
          }
        } catch (error) {
          console.error("Fetch error:", error);
          Alert.alert("Error", "Something went wrong. Check your network connection.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    }, [])
  );

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Handle sending friend request
  const handleSendingReq = async (friendId: string) => {
    try {
      setProcessingFriendId(friendId);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/user/sending-req`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Friend request sent.");
      } else {
        Alert.alert("Error", data.message || "Could not send request");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Check your network connection.");
    } finally {
      setProcessingFriendId(null);
    }
  };

  // Render each user card
  const renderFriendItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          processingFriendId === item._id && styles.buttonDisabled,
        ]}
        onPress={() => handleSendingReq(item._id)}
        disabled={!!processingFriendId}
      >
        {processingFriendId === item._id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header with back button */}
      <View style={styles.titleContainer}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#f9df7b" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>People you might know</Text>
      </View>

      {/* Search bar */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#cccccc"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search user..."
          placeholderTextColor="#C9D3DB"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#cccccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Conditional rendering: loader, no results, or list */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#B88A4E" style={{ marginTop: 20 }} />
      ) : filteredUsers.length === 0 ? (
        <Text style={styles.noResultsText}>
          No users found matching "{searchQuery}"
        </Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderFriendItem}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS === "web"
              ? {
                  maxHeight: Dimensions.get("window").height - 200,
                  overflow: "hidden",
                }
              : null,
          ]}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    position: "absolute",
    left: 0, 
  },
  title: {
    marginTop: 20,
    fontSize: 20, 
    fontWeight: "bold",
    color: "#f9df7b",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    color: "#f9df7b",
    fontSize: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  userCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "#BDB298",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#f9df7b",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#1E1E1E",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: "#666",
  },
  noResultsText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 100,
  },
});

export default AddFriendsScreen;
