import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FriendsList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', 
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#B88A4E',
    letterSpacing: 1,
  },
});

export default FriendsList;
