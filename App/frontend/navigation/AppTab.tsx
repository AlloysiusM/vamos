import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Ionicons from "react-native-vector-icons/Ionicons"
import { View, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"

// Page imports
import LandingPage from "../screens/LandingPage"
import SearchPage from "../screens/SearchPage"
import ProfilePage from "../screens/ProfilePage"
import NotificationsPage from "../screens/NotificationPage"
import FavouritesPage from "../screens/FavouritesPage"
import FriendsListScreen from "../screens/FriendsListScreen"
import ScheduleScreen from "../screens/ScheduleScreen"
import EventActivities from "../screens/EventActivitiesScreen"
import CreateEvent from "../screens/EventActivitiesCreationScreen";
import AddFriendScreen from "../screens/AddFriendsScreen"
import FindMe from "../screens/FindNearMe"

// To get navbar to show on screens without adding to Tab stack
const HomeStack = createStackNavigator()
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={LandingPage}  options={{ headerShown: false }}/>
    <HomeStack.Screen name="EventActivities" component={EventActivities} />
    <HomeStack.Screen name="FriendsList" component={FriendsListScreen} />
    <HomeStack.Screen name="Schedule" component={ScheduleScreen} />
    <HomeStack.Screen name="CreateEvent" component={CreateEvent} />
    <HomeStack.Screen name="FindMe" component={FindMe} />
    <HomeStack.Screen name="AddFriend" component={AddFriendScreen} />
  </HomeStack.Navigator>
)

// For profile friend list and settings pages
const ProfileStack = createStackNavigator()
const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfilePage} />
    <ProfileStack.Screen name="FriendsList" component={FriendsListScreen} />
  </ProfileStack.Navigator>
)

// Main tab navigator
const Tab = createBottomTabNavigator()

const AppTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = ""

          if (route.name === "Home") {
            iconName = "home-outline"
          } else if (route.name === "Search") {
            iconName = "search-outline"
          } else if (route.name === "Favourites") {
            iconName = "star-outline"
          } else if (route.name === "Notification") {
            iconName = "notifications-outline"
          } else if (route.name === "Profile") {
            iconName = "person-outline"
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          )
        },
        tabBarActiveTintColor: "#f9df7b",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      {/* Navbar tab stack */}
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesPage}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Notification"
        component={NotificationsPage}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{ headerShown: false }} 
      />
      
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: "#121212",
    borderRadius: 25,
    height: 80,
    paddingBottom: 20,
    borderTopWidth: 0,
    paddingTop: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
})

export default AppTab

