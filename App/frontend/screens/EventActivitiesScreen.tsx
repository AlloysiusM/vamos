import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, Dimensions, Platform, Alert } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { API_URL } from '@env';


// Drawer and stack nav for sidebar
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  maxPeople: number;
  startTime: number;
  endTime: number;
  currentPeople: number;
  user: string;
}

// main event activities page
const EventActivities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [signedUpEvents, setSignedUpEvents] = useState<Set<string>>(new Set());
  
  const EventSignup = async (eventId: string) => {
    try
    {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to join event");
      }
      

      setSignedUpEvents((prev) => {
      const updated = new Set(prev);
      if (updated.has(eventId)) {
        updated.delete(eventId);
      } else {
        updated.add(eventId);
      }
      return updated;
    });
      
    }catch(error){
      console.error("error");
    }
  }

  // Fetch events from the backend API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setError("User not logged in");
          return;
        }

        const response = await fetch(`${API_URL}/api/events`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Error fetching events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search input and filter events based on the query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) =>
          event.title?.toLowerCase().includes(query.toLowerCase()) // Filter events based on title
        )
      );
    }
  };

  // Render each event item in the list
  const renderEvent = ({ item }: { item: Event }) => {

    // Date formatting for start and end times
    const startDate = item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A';
    const endDate = item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A';

    return (
      <View style={{ width: windowWidth - 40, marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
        <Text style={styles.eventTitleStyle}>{item.title || 'Unnamed Event'}</Text>
        <Text style={styles.eventCategory}>Category: {item.category || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Location: {item.location || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Start Time: {startDate}</Text>
        <Text style={styles.eventDetails}>End Time: {endDate}</Text>
        <Text style={styles.eventDetails}>Max People: {item.maxPeople || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Current People: {item.currentPeople || 'N/A'}</Text>
        <TouchableOpacity onPress={() => EventSignup(item._id)}>
          <Text style={{ fontSize: 15, marginVertical: 10, color: "#B88A4E" }}>
            {signedUpEvents.has(item._id) ? "Unsign up" : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="search" size={24} color="#C9D3DB" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search for activities..."
            placeholderTextColor="#C9D3DB"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {isLoading ? (
        <ActivityIndicator size="large" color="#B88A4E" />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          contentContainerStyle={[
            styles.flatListContentStyle,
            Platform.OS === 'web' ? { maxHeight: Dimensions.get('window').height - 200, overflow: 'hidden' } : null,
          ]}
        />
      )}
      </View>
    </SafeAreaView>
  );
};

// Side nav
const DrawerContent = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2E2E2E" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, color: "#B88A4E" }}>Categories</Text>
      <TouchableOpacity>
        <Text style={{ fontSize: 18, marginVertical: 10, color: "#B88A4E" }}>Football</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{ fontSize: 18, marginVertical: 10, color: "#B88A4E" }}>Basketball</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stack Screen with Drawer Button (3 lines nav btn)
const EventStack = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventActivities"
        component={EventActivities}
        options={{
          title: "My Events",
          headerStyle: { backgroundColor: "#1E1E1E" },
          headerTintColor: "#B88A4E",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
              <Ionicons name="menu" size={28} color="#B88A4E" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("CreateEvent")} style={{ marginRight: 15 }}>
              <Ionicons name="add-outline" size={28} color="#B88A4E" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// Main Drawer Navigation
const EventsScreenDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent />}
      initialRouteName="My Events"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="My Events" component={EventStack} />
    </Drawer.Navigator>
  );
};

export default EventsScreenDrawer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  eventDetails: {
    color: "#C9D3DB",
    fontSize: 14,
    marginBottom: 4,
  },

  eventCategory: {
    color: "#C9D3DB",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#B88A4E",
    letterSpacing: 1,
    marginBottom: 20,
  },

  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
  },

  searchIcon: {
    marginRight: 10,
  },

  input: {
    height: 50,
    fontSize: 16,
    fontWeight: "500",
    color: "#C9D3DB",
    flex: 1,
  },

  inputField: {
    height: 50,
    fontSize: 16,
    fontWeight: "500",
    color: "#C9D3DB",
    width: "100%",
  },

  eventsContainer: {
    flex: 1,
    width: "100%",
  },

  flatListContentStyle: {
    paddingBottom: 120,
  },

  eventTitleStyle: {
    color: "#C9D3DB",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  eventItemStyle: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    minHeight: 150,
  },

  eventNameStyle: {
    color: "#C9D3DB",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  eventDescriptionStyle: {
    color: "#C9D3DB",
    fontSize: 14,
    lineHeight: 20,
  },

  buttonStyle: {
    backgroundColor: "#B88A4E",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  buttonTextStyle: {
    color: "#1E1E1E",
    fontSize: 18,
    fontWeight: "600",
  },

  eventDetailsStyle: {
    color: "#C9D3DB",
    fontSize: 14,
    marginBottom: 4,
  },

  eventCategoryStyle: {
    color: "#C9D3DB",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
});