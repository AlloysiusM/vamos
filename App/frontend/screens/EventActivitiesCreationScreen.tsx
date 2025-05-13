import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal, Keyboard, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/config';

// ts declaration
interface CreateEventScreenProps {
  onAddEvent: (
    event: { 
      category: string; 
      title: string; 
      description: string; 
      location: string; 
      maxPeople: number; 
      startTime: Date; 
      endTime: Date; 
    }
  ) => void;
}

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ onAddEvent }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [maxPeople, setMaxPeople] = useState(1);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [error, setError] = useState("");
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const maxDate = new Date();

  const handleSubmit = async () => {
    const event = { 
      category, 
      title, 
      description, 
      location, 
      maxPeople, 
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    };

    console.log('Event:', event); 

    const token = await AsyncStorage.getItem('token');
  
    if (!token) {
      setError('User not logged in');
      return;
    }
  
    const response = await fetch(`${BASE_URL}/api/events`, { 
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    const json = await response.json();
    console.log('Response:', json); 
    
    if (!response.ok) {
      setError(json.error || 'Error creating event');
    } else {
      setTitle('');
      setDescription('');
      setLocation('');
      setMaxPeople(1);
      setStartTime(new Date());
      setEndTime(new Date());
      setCategory('');
      setError('Event created successfully!');
      onAddEvent(json);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);  // Close modal after selection
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput 
        placeholderTextColor="#d3d3d3" 
        style={styles.input} 
        value={title} 
        onChangeText={setTitle} 
        placeholder="Enter title" 
      />
      
      {/* Category Picker */}
      <Text style={styles.label}>Category</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setCategoryModalVisible(true)} // Open modal when pressed
      >
        <Text style={styles.placeholder}>{category || 'Select a category'}</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal 
        visible={isCategoryModalVisible} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Select Category</Text>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={[styles.input, { color: '#fff' }]}
            >
              <Picker.Item label="Select a category" value="" />
              <Picker.Item label="Football" value="football" />
              <Picker.Item label="Basketball" value="basketball" />
              <Picker.Item label="Yoga" value="yoga" />
              <Picker.Item label="Gym session" value="gym" />
              <Picker.Item label="Tennis" value="tennis" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setCategoryModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput 
        placeholderTextColor="#d3d3d3" 
        style={styles.input} 
        value={description} 
        onChangeText={setDescription} 
        placeholder="Enter description" 
        multiline 
        blurOnSubmit={true} 
        onSubmitEditing={() => Keyboard.dismiss()} 
      />

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <TextInput 
        style={styles.input} 
        value={location} 
        onChangeText={setLocation} 
        placeholder="Enter location" 
      />

      {/* Max People */}
      <Text style={styles.label}>Max People: {maxPeople}</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={() => setMaxPeople((prev) => Math.max(1, prev - 1))} style={styles.counterButton}>
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{maxPeople}</Text>
        <TouchableOpacity onPress={() => setMaxPeople((prev) => prev + 1)} style={styles.counterButton}>
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Start Time Picker */}
      <Text style={styles.label}>Start Time</Text>
      {Platform.OS === "web" ? (
        <input
          style={{ ...styles.input, padding: 8 }}
          type="datetime-local"
          value={startTime.toISOString().slice(0, 16)}
          onChange={(e) => setStartTime(new Date(e.target.value))}
        />
      ) : (
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisible(true)}>
          <Text style={styles.dateText}>{startTime.toLocaleString()}</Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        display="inline"
        minimumDate={maxDate}
        onConfirm={(date) => {
          setStartTime(date);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
        pickerStyleIOS={{ backgroundColor: "#1e1e1e" }} 
      />

      {/* End Time Picker */}
      <Text style={styles.label}>End Time</Text>
      {Platform.OS === "web" ? (
        <input
          style={{ ...styles.input, padding: 8 }}
          type="datetime-local"
          value={endTime.toISOString().slice(0, 16)}
          onChange={(e) => setEndTime(new Date(e.target.value))}
        />
      ) : (
        <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisible(true)}>
          <Text style={styles.dateText}>{endTime.toLocaleString()}</Text>
        </TouchableOpacity>
      )}
      
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        display="inline"
        minimumDate={maxDate}
        onConfirm={(date) => {
          setEndTime(date);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
        pickerStyleIOS={{ backgroundColor: "#1e1e1e" }} 
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Event</Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
};
const THEME_COLOR = "#f9df7b";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000000",
    paddingTop: 50, 
  },
  label: {
    fontSize: 15, 
    fontWeight: "600",
    color: THEME_COLOR,
    marginBottom: 8, 
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 12, 
    borderRadius: 12, 
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18, 
  },
  counterButton: {
    backgroundColor: "#2b2b2b",
    padding: 12, 
    borderRadius: 8,
  },
  counterText: {
    fontSize: 20, 
    color: "#fff",
  },
  counterValue: {
    fontSize: 18, 
    color: THEME_COLOR,
    marginHorizontal: 14, 
  },
  dateButton: {
    backgroundColor: "#1a1a1a",
    padding: 12, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    alignItems: "center",
    marginBottom: 18,
  },
  dateText: {
    color: "#f0f0f0",
    fontSize: 16, 
  },
  submitButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 14,
    borderRadius: 12, 
    alignItems: "center",
    marginTop: 18, 
  },
  submitText: {
    color: "#fff",
    fontSize: 16, 
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 14, 
    marginTop: 10, 
    fontWeight: "500",
  },
  placeholder: {
    color: "#ccc",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20, 
    borderRadius: 16,
    width: "90%",
  },
  
  picker: {
    height: 180,
    width: "100%",
    color: "#f0f0f0",
  },
  closeButton: {
    marginTop: 18, 
    padding: 12,
    backgroundColor: THEME_COLOR,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CreateEventScreen;
