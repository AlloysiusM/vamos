import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import { useEvents } from "../states/contexts/EventContext";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const Schedule = () => {

  // Call EventContext data
  const { signedUpEvents } = useEvents();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

    // Mark events with a dot
    events.forEach((event) => {
      if (!marked[event.date]) {
        marked[event.date] = {
          marked: true,
          dotColor: "#ff0000",
        };
      }
    });

    // Highlight the selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate], // Keep existing marks if any
        selected: true,
        selectedColor: "#B88A4E",
        selectedTextColor: "#fff", 
      };
    }

    return marked;
  };

  // Filter events for selected date
  const eventsForSelectedDate = selectedDate
    ? formattedEvents.filter((event) => event.date === selectedDate)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Schedule</Text>

        <Calendar
          onDayPress={(day: { dateString: React.SetStateAction<string | null>; }) => setSelectedDate(day.dateString)}
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
    marginBottom: 10,
  },
  eventsBox: {
    flex: 1,
    marginTop: 10,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "#2C2C2C",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B88A4E",
    marginBottom: 5,
  },
  eventDetail: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 3,
  },
  noEvents: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Schedule;