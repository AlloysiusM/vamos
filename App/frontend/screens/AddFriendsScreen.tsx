import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const AddFriendsScreen: React.FC = () => {

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'AddFriend'>>();
      const [fullName, setFullName] = useState('');
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
                
                setFullName(data.fullName);
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
  
  return (
    <View style={styles.container}>
        <Text style={styles.title}>People you might know</Text>
        <Text> {fullName}</Text>
    </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B88A4E",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 34,
    marginTop: -520,
    
    
  },


});

export default AddFriendsScreen;
