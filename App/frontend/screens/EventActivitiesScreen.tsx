import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, Dimensions, Platform, Alert } from "react-native";
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { BASE_URL } from '../utils/config';
import { useEvents } from '../states/contexts/EventContext';


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
const EventActivities = ({ route }: { route: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const windowWidth = Dimensions.get("window").width;
  const { signedUpEvents, addSignedUpEvent, removeSignedUpEvent, addFavoriteEvent, removeFavoriteEvent, isFavorite} = useEvents();
  const [userId, setUserId] = useState<string | null>(null);

  
  
  const EventSignup = async (eventId: string) => {
    const eventToUpdate = events.find(event => event._id === eventId);
    if (!eventToUpdate) {
      Alert.alert("Error", "Event not found.");
      return;
    }
  
    const token = await AsyncStorage.getItem("token");
    const isAlreadySignedUp = signedUpEvents.some(e => e._id === eventId);
  
    const confirmAction = async () => {
      try {
        const endpoint = isAlreadySignedUp
          ? `${BASE_URL}/api/events/${eventId}/withdraw`
          : `${BASE_URL}/api/events/${eventId}`;
  
        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Request failed");
        }
  
        if (isAlreadySignedUp) {
          removeSignedUpEvent(eventId);
          console.log(`Removed from event: ${eventToUpdate.title}`);
        } else {
          addSignedUpEvent({
            _id: eventToUpdate._id,
            title: eventToUpdate.title,
            startTime: eventToUpdate.startTime,
            endTime: eventToUpdate.endTime,
            location: eventToUpdate.location,
            details: "",
            date: ""
          });
          console.log(`Signed up for event: ${eventToUpdate.title}`);
        }
  
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId
              ? { ...event, currentPeople: data.currentPeople }
              : event
          )
        );
      } catch (error) {
        console.error("Error updating event signup:", error);
        Alert.alert("Error", "Failed to update event signup.");
      }
    };
  
    // Show confirmation alert
    Alert.alert(
      isAlreadySignedUp ? "Unsign from Event" : "Sign Up for Event",
      `Are you sure you want to ${isAlreadySignedUp ? "unsign" : "sign up"} for "${eventToUpdate.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: confirmAction }
      ]
    );
  };

  // Fetch events from the backend API on component mount
useEffect(() => {
  const fetchEvents = async () => {
    setIsLoading(true);

const storedUserId = await AsyncStorage.getItem("userId");

    if (storedUserId) setUserId(storedUserId);
console.log("Fetched userId from AsyncStorage:", storedUserId);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setError("User not logged in");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/events`, {
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

      // ✅ Optional: Log events and check `user` field
      console.log("Fetched events:", data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Error fetching events.");
    } finally {
      setIsLoading(false);
    }
  };

  fetchEvents();
}, []);


  // Handle category selection from drawer
  useEffect(() => {
    if (route.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);
      filterEventsByCategory(route.params.selectedCategory);
    } else {
      setSelectedCategory(null);
      setFilteredEvents(events);
    }
  }, [route.params?.selectedCategory, events]);

  // Filter events by category
  const filterEventsByCategory = (category: string) => {
    if (category === "All") {
      setFilteredEvents(events);
      setSelectedCategory(null);
    } else {
      setFilteredEvents(
        events.filter((event) => 
          event.category?.toLowerCase() === category.toLowerCase()
        )
      );
    }
  };

  // Handle search input and filter events based on the query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      if (selectedCategory) {
        filterEventsByCategory(selectedCategory);
      } else {
        setFilteredEvents(events);
      }
    } else {
      setFilteredEvents(
        events.filter((event) =>
          event.title?.toLowerCase().includes(query.toLowerCase()) && 
          (selectedCategory ? event.category?.toLowerCase() === selectedCategory.toLowerCase() : true)
        )
      );
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'Failed to delete event');
    }

    
    console.log('Event deleted:', json);
  } catch (err) {
    console.error('Error deleting event:');
  }
};


  // Render each event item in the list
  const renderEvent = ({ item }: { item: Event }) => {
    const startDate = item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A';
    const endDate = item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A';

    
      
    return (
      <View style={{ width: windowWidth - 40, marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
        
        {/* Title and heart icon in one row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.eventTitleStyle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {item.title || 'Unnamed Event'}
          </Text>
          <TouchableOpacity onPress={() => {
            const alreadyFav = isFavorite(item._id);
            if (alreadyFav) {
              removeFavoriteEvent(item._id);
            } else {
              addFavoriteEvent({
                ...item,
                details: item.description || '',
                date: item.startTime ? new Date(item.startTime).toISOString() : '',
              });
            }
          }}>
            <Ionicons 
              name={isFavorite(item._id) ? "star" : "star-outline"} 
              size={24} 
              color={isFavorite(item._id) ? "#FF6347" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.eventCategory}>Category: {item.category || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Location: {item.location || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Start Time: {startDate}</Text>
        <Text style={styles.eventDetails}>End Time: {endDate}</Text>
        <Text style={styles.eventDetails}>Max People: {item.maxPeople || 'N/A'}</Text>
        <Text style={styles.eventDetails}>Current People: {item.currentPeople || 'N/A'}</Text>

        <TouchableOpacity onPress={() => EventSignup(item._id)}>
          <Text style={styles.eventCategory}>
            {signedUpEvents.some(event => event._id === item._id) ? "Unsign up" : "Sign Up"}
          </Text>
        </TouchableOpacity>
        
        {item.user === userId && (
        <TouchableOpacity
          onPress={() => handleDeleteEvent(item._id)} style={{ marginTop: 10 }} >
        <Text style={[styles.eventCategory, { color: "#FF6B6B" }]}>Delete</Text>
        </TouchableOpacity>
)}
        
        

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

        {selectedCategory && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#f9df7b', marginRight: 10 }}>Filtering by:</Text>
            <Text style={{ color: '#B88A4E', fontWeight: 'bold' }}>{selectedCategory}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedCategory(null);
                setFilteredEvents(events);
              }}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="close" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}

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
const DrawerContent = (props: DrawerContentComponentProps) => {
  const categories = ["Football", "Basketball", "Yoga", "Running", "Gym session", "Tennis", "All"];

  const handleCategorySelect = (category: string) => {
    props.navigation.navigate("EventStack", { 
      screen: "EventActivitiesScreen",
      params: { selectedCategory: category }
    });
    props.navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#000000", paddingTop: 50 }}>
      <Text style={{ fontSize: 24, marginTop: 100, marginBottom: 20, color: "#f9df7b" }}>Categories</Text>
      
      <View style={{ width: '80%', height: 1, backgroundColor: '#ffffff', marginBottom: 20 }} />

      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => handleCategorySelect(category)}
          style={{ width: '100%', padding: 15, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 18, marginVertical: 5, color: "#f9df7b" }}>{category}</Text>
        </TouchableOpacity>
        
      ))}
    </View>
  );
};


// Stack Screen with Drawer Button (3 lines nav btn)
const EventStack = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventActivitiesScreen" 
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
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="EventStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="EventStack" 
        component={EventStack}
        options={{
          title: "My Events",
        }}
      />
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

  backButton: {
      position: 'absolute',
      left: -10,
      top: 0,
      padding: 10,
      zIndex: 1,
  },
});