import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const FindActivity: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Activity</Text>

      {/* Search Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Search for activities..." 
          placeholderTextColor="#C9D3DB"
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
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

  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },

  input: {
    height: 50,
    backgroundColor: '#333', 
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    width: '100%',
    color: '#C9D3DB', 
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    elevation: 3, 
  },

  button: {
    backgroundColor: '#B88A4E',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  buttonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FindActivity;