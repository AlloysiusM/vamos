import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const CreateEventScreen = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [maxPeople, setMaxPeople] = useState(1);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setStartDate(selectedDate);
    }
    setShowStartPicker(false);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setEndDate(selectedDate);
    }
    setShowEndPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.input}>
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Sports" value="sports" />
        <Picker.Item label="Music" value="music" />
        <Picker.Item label="Networking" value="networking" />
      </Picker>

      {/* Title Input */}
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

      {/* Description Input */}
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />

      {/* Location Input */}
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location" />

      {/* Max People Counter */}
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

      {/* Start Date Picker */}
      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
        <Text>{startDate.toLocaleString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker value={startDate} mode="datetime" display="default" onChange={handleStartDateChange} />
      )}

      {/* End Date Picker */}
      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
        <Text>{endDate.toLocaleString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker value={endDate} mode="datetime" display="default" onChange={handleEndDateChange} />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Event</Text>
      </TouchableOpacity>
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
});

export default CreateEventScreen;