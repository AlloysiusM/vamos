import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Drawer and stack nav for sidebar
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// dummy data
const dummyEvents = [
  { id: "1", name: "Football Match - Local League", description: "A local football match featuring teams from the area." },
  { id: "2", name: "Basketball Tournament - Charity Event", description: "A charity basketball event to raise funds for a cause." },
  { id: "3", name: "Music Concert - Rock Festival", description: "A rock music festival with multiple bands performing." },
  { id: "4", name: "Coding Bootcamp - Web Development", description: "An intensive bootcamp teaching full-stack web development." },
  { id: "5", name: "Art Exhibition - Modern Artists", description: "An exhibition showcasing modern and contemporary art." },
  { id: "6", name: "Food Festival - Local Cuisine", description: "A food festival celebrating local and international cuisine." },
  { id: "7", name: "Yoga Retreat - Relaxation & Wellness", description: "A weekend yoga retreat focused on relaxation and wellness." },
  { id: "8", name: "Running Marathon - City Challenge", description: "A marathon through the city streets for all fitness levels." },
  { id: "9", name: "Tech Conference - Innovation & Trends", description: "A conference showcasing the latest in tech and innovation." },
  { id: "10", name: "Movie Night - Outdoor Screening", description: "An outdoor movie screening under the stars." },
  { id: "11", name: "Tech Conference - Innovation & Trends", description: "A conference showcasing the latest in tech and innovation." },
  { id: "12", name: "Movie Night - Outdoor Screening", description: "An outdoor movie screening under the stars." },
  { id: "13", name: "Tech Conference - Innovation & Trends", description: "A conference showcasing the latest in tech and innovation." },
  { id: "14", name: "Movie Night - Outdoor Screening", description: "An outdoor movie screening under the stars." },
];


// main event activities page;
const EventActivities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(dummyEvents);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // if empty show all
    if (query === "") {
      setFilteredEvents(dummyEvents); 
    } else {

      // Str lowercase
      setFilteredEvents(
        dummyEvents.filter((event) =>
          event.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Events</Text>

      {/* Search bar */}
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

      {/* List showing event data */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
          )}
        />
    </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#B88A4E",
    letterSpacing: 1,
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
    width: "100%",
  },

  flatListContainer: {
    width: "100%",
    paddingBottom: 30,
  },

  eventItem: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: "100%",
  },

  eventName: {
    color: "#C9D3DB",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  eventDescription: {
    color: "#C9D3DB",
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
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

  buttonText: {
    color: "#1E1E1E",
    fontSize: 18,
    fontWeight: "600",
  },
});
