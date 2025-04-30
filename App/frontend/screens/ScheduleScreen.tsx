import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";

// Dummy joined event data
const joinedEvents = [
  {
    id: "1",
    title: "Basketball tournament",
    date: "2025-04-20",
    time: "14:00",
    location: "Aut Gym",
  },
  {
    id: "2",
    title: "Football",
    date: "2025-04-20",
    time: "18:30",
    location: "Stadium",
  },
  {
    id: "3",
    title: "Gymnastics with the boys",
    date: "2025-04-25",
    time: "09:00",
    location: "Aut Gym",
  },
];

const getMarkedDates = (events: typeof joinedEvents, selectedDate: string | null) => {
  const marked: any = {};

  // Mark events with a dot
  events.forEach((event) => {
    marked[event.date] = {
      marked: true,
      dotColor: "#ff0000",
    };
  });

  // Highlight the selected date
  if (selectedDate) {
    marked[selectedDate] = {
      selected: true,
      selectedColor: "#B88A4E",
      selectedTextColor: "#fff", 
    };
  }

  return marked;
};

const Schedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Filter events for selected date
  const eventsForSelectedDate = selectedDate
    ? joinedEvents.filter((event) => event.date === selectedDate)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Schedule</Text>

        <Calendar
          onDayPress={(day: { dateString: React.SetStateAction<string | null>; }) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates(joinedEvents, selectedDate)} 
          style={styles.calendar}
        />

        <View style={styles.eventsBox}>
          <Text style={styles.eventsTitle}>
            {selectedDate
              ? `Events on ${selectedDate}`
              : "Select a date to see events"}
          </Text>

          {eventsForSelectedDate.length > 0 ? (
            <FlatList
              data={eventsForSelectedDate}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDetail}>⏰ {item.time}</Text>
                  <Text style={styles.eventDetail}>📍 {item.location}</Text>
                </View>
              )}
            />
          ) : (
            selectedDate && (
              <Text style={styles.noEvents}>No events on this day.</Text>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#B88A4E",
    letterSpacing: 1,
    textAlign: "center",
  },
  calendar: {
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    height: 360,
  },
  eventsBox: {
    flex: 1,
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "#2C2C2C",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B88A4E",
  },
  eventDetail: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  noEvents: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
  },
});

export default Schedule;
