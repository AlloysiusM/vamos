import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const AddFriendsScreen: React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'AddFriend'>>();
      const [users, setUsers] = useState<any[]>([]);
      const [isLoading, setIsLoading] = useState(true); 
  
      useFocusEffect(
        useCallback(() => {
          console.log('fa');
          
          
          const fetchUserName = async () => {
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
    
              const response = await fetch(`${API_URL}/api/user/add-friends`, {
                
                
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
      
          fetchUserName();
        }, [])
      );

      const handleSendingReq = async (friendId: string) => {
        
            try {
              const token = await AsyncStorage.getItem('token');
    
              if (!token) {
                console.log('dfd');
                
                // Handle case where user is not logged in (e.g., redirect to login)
                Alert.alert('Error', 'You are not logged in.');
                // Example: navigation.navigate('Login'); // Or your login screen name
                
                return;
              }

    
          // Post data to db
            const response = await fetch(`${API_URL}/api/user/sending-req`, {
              
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ friendId }), // send the friend ID you want to notify
            });

            
            const data = await response.json();
    
            console.log(data);

            console.log('Sending Friend Request to:', `${API_URL}/api/user/sending-req`);
console.log('Token:', token);
console.log('ReceiverId:', friendId);

            if (response.ok) {
              Alert.alert('Sending request successfully.');
            } else {
             // Handle specific errors (e.g., token expired -> redirect to login)
             
              Alert.alert('Error', data.message || 'Could not send request');
         
       }
          } catch (error) {
            Alert.alert('Error', 'Something went wrong while fetching profile. Check your network connection and API server.');
          }
  
        };
      
  
  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>People you might know</Text>
        {isLoading ? (
        <ActivityIndicator size="large" color="#B88A4E" style={{ marginTop: 20 }} />
      ) : (
        users.map((user) => (
          <View key={user._id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.fullName}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => handleSendingReq(user._id)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B88A4E",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 20,
  },

  userCard: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flex: 1,
  },

  name: {
    color: "#F9DF7B",
    fontSize: 18,
    fontWeight: "600",
  },
  email: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#B88A4E",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
});

export default AddFriendsScreen;
