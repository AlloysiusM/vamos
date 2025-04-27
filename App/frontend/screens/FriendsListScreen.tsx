import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";

const FriendsList: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  
  return (
    <View style={styles.container}>
      {/* Row with title and icon */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Friends List</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddFriend")}
          style={styles.addButton}
        >
          <Ionicons name="add-outline" size={28} color="#f9df7b" />
        </TouchableOpacity>
      </View>
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
    marginTop: -160,
  },

  headerRow: {
    alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  marginTop: -520,
  backgroundColor: "#1E1E1E",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B88A4E",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 34,
  },

  addButton: {
    position: 'absolute',
  right: -10,
  top: -5,
  padding: 10,
  },


});

export default FriendsList;
