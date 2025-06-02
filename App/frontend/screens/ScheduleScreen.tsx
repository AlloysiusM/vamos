import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useEvents } from "../states/contexts/EventContext";
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const Schedule = () => {
  const { signedUpEvents, currentUserId } = useEvents();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigation = useNavigation();

  // Format events
  const formattedEvents: CalendarEvent[] = signedUpEvents.map((event: { _id: any; title: any; startTime: string | number | Date; endTime: string | number | Date; location: any; }) => ({
    id: event._id,
    title: event.title,
    date: new Date(event.startTime).toISOString().split('T')[0],
    time: `${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    location: event.location
  }));

  const getMarkedDates = (events: CalendarEvent[], selectedDate: string | null) => {
    const marked: Record<string, any> = {};

    events.forEach((event) => {
      if (!marked[event.date]) {
        marked[event.date] = {
          marked: true,
          dotColor: "#ff0000",
        };
      }
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: "#B88A4E",
        selectedTextColor: "#fff", 
      };
    }

    return marked;
  };

  const eventsForSelectedDate = selectedDate
    ? formattedEvents.filter((event) => event.date === selectedDate)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#f9df7b" />
          </TouchableOpacity>

          <Text style={styles.title}>Schedule</Text>

          <View style={{ width: 34 }} /> 
        </View>

        {!currentUserId ? (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Please log in to view your schedule</Text>
          </View>
        ) : (
          <>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={getMarkedDates(formattedEvents, selectedDate)}
              style={styles.calendar}
              theme={{
                backgroundColor: "#1E1E1E",
                calendarBackground: "#1E1E1E",
                textSectionTitleColor: "#B88A4E",
                selectedDayBackgroundColor: "#B88A4E",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: "#B88A4E",
                dayTextColor: "#FFFFFF",
                textDisabledColor: "#555",
                arrowColor: "#B88A4E",
                monthTextColor: "#B88A4E",
                indicatorColor: "#B88A4E",
                textDayFontWeight: "300",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "300",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
              }}
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
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              ) : (
                selectedDate && (
                  <Text style={styles.noEvents}>No events on this day.</Text>
                )
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f9df7b",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    height: 360,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  eventsBox: {
    flex: 1,
    marginTop: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9df7b",
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f9df7b",
    marginBottom: 6,
  },
  eventDetail: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 2,
  },
  noEvents: {
    color: "#aaa",
    fontStyle: "italic",
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 34,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#f9df7b',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Schedule;