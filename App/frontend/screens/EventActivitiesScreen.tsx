import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, Dimensions, Platform } from "react-native";
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

        const response = await fetch(`${API_URL}/api/events`, 
          {
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
        <TouchableOpacity onPress={() => navigation.navigate("s")}>
          <Text style={{ fontSize: 15, marginVertical: 10, color: "#cccccc"}}>More details</Text>
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
          headerTintColor: "#f9df7b",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
              <Ionicons name="menu" size={28} color="#f9df7b" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("CreateEvent")} style={{ marginRight: 15 }}>
              <Ionicons name="add-outline" size={28} color="#f9df7b" />
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
    backgroundColor: "#121212", 
  },

  container: {
    flex: 1,
    backgroundColor: "#000000", 
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  errorText: {
    color: "#FF6B6B",  
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",  
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212", 
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E1E1E",  
    shadowColor: "#000",
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4,  
  },

  searchIcon: {
    marginRight: 10,
    color: "#cccccc",  
  },

  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "400", 
    paddingVertical: 6,
    letterSpacing: 1.0, 
  },

  flatListContentStyle: {
    paddingBottom: 120,
  },

  eventTitleStyle: {
    fontSize: 22,  
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    letterSpacing: 1.0,  
    textTransform: "uppercase",
  },

  eventCategory: {
    fontSize: 16,
    color: "#f9df7b",
    marginBottom: 10,
    fontWeight: "400", 
    textTransform: "capitalize",
    letterSpacing: 0.8, 
  },

  eventDetails: {
    fontSize: 14,
    color: "#C0C0C0",
    marginBottom: 8,
    fontWeight: "300",
    letterSpacing: 1.0,  
  },

  eventItemStyle: {
    backgroundColor: "#292929", 
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, 
    shadowRadius: 12,
    elevation: 6, 
  },

  eventItemStyleHover: {
    backgroundColor: "#333", 
    transform: [{ scale: 1.02 }], 
    shadowOpacity: 0.2, 
  },

  buttonStyle: {
    backgroundColor: "#B88A4E",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 15,
    elevation: 3,

  },

  buttonTextStyle: {
    color: "#1E1E1E",
    fontSize: 18, 
    fontWeight: "600",
    letterSpacing: 1.2,
  },

  buttonStyleActive: {
    backgroundColor: "#A2743D", 
  },

  eventItemStyleTouch: {
    backgroundColor: "#292929",
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1 }],
  },

  eventItemStyleTouchActive: {
    transform: [{ scale: 1.02 }],
    backgroundColor: "#333", 
    shadowOpacity: 0.18,
  },
});