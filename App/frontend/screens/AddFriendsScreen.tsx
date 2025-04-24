import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddFriendScreen: React.FC = () => {
  
  return (
    <View style={styles.container}>
        <Text style={styles.title}>People you might know</Text>
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

export default AddFriendScreen;
