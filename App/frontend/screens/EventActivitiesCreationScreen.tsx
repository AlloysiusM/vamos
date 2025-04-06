import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';


 // ts declaration
interface CreateEventScreenProps {
  onAddEvent: (
    event: 
      { 
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
  
    const response = await fetch('http://localhost:5001/api/events', { 
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
  
  return (
    <View style={styles.container}>
      {/* Category Picker */}
      <Text style={styles.label}>Category</Text>
      <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.input}>
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Sports" value="sports" />
        <Picker.Item label="Music" value="music" />
        <Picker.Item label="Networking" value="networking" />
      </Picker>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location" />

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
      {Platform.OS === "web" ? (
        <input
          style={{ ...styles.input, padding: 8 }}
          type="datetime-local"
          value={startTime.toISOString().slice(0, 16)}
          onChange={(e) => setStartTime(new Date(e.target.value))}
        />
      ) : (
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisible(true)}>
          <Text>{startTime.toLocaleString()}</Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal isVisible={isStartPickerVisible} mode="datetime" onConfirm={(date) => { setStartTime(date); setStartPickerVisible(false); }} onCancel={() => setStartPickerVisible(false)} />

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
          <Text>{endTime.toLocaleString()}</Text>
        </TouchableOpacity>
      )}
      <DateTimePickerModal isVisible={isEndPickerVisible} mode="datetime" onConfirm={(date) => { setEndTime(date); setEndPickerVisible(false); }} onCancel={() => setEndPickerVisible(false)} />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Event</Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  counterContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  counterButton: { backgroundColor: "#ddd", padding: 10, borderRadius: 5 },
  counterText: { fontSize: 20 },
  counterValue: { fontSize: 18, marginHorizontal: 10 },
  dateButton: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  submitButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "red", marginTop: 10, fontSize: 16 },
});

export default CreateEventScreen;
