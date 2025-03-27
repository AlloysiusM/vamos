import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';

// Page imports
import LandingPage from '../screens/LandingPage';
import SearchPage from '../screens/SearchPage';
import ProfilePage from '../screens/ProfilePage';
import NotificationsPage from '../screens/NotificationPage';
import FavouritesPage from '../screens/FavouritesPage';
import FindActivity from "../screens/FindActivityScreen";
import HostActivity from "../screens/HostActivityScreen";
import FriendsList from "../screens/FriendsListScreen";
import Schedule from "../screens/ScheduleScreen";


// nav stack type
export type RootStackParamList = {
  Landing: undefined;
  Search: undefined;
  Favourites: undefined;
  Notification: undefined;
  Profile: undefined;
  FindActivity: undefined;
  HostActivity: undefined;
  FriendsList: undefined;
  Schedule: undefined;
  
};

// create navbar list
const Tab = createBottomTabNavigator<RootStackParamList>();

const AppTab = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string = '';

            if (route.name === 'Landing') {
              iconName = 'home-outline';
            } else if (route.name === 'Search') {
              iconName = 'search-outline';
            } else if (route.name === 'Favourites') {
              iconName = 'star-outline';
            } else if (route.name === 'Notification') {
              iconName = 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }else if (route.name === 'FindActivity') {
              iconName = 'walk-outline';
            } else if (route.name === 'HostActivity') {
              iconName = 'people-outline';
            } else if (route.name === 'FriendsList') {
              iconName = 'chatbubble-outline';
            } else if (route.name === 'Schedule') {
              iconName = 'calendar-outline';
            }  

            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          },
          tabBarActiveTintColor: '#B88A4E',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false, 
          tabBarStyle: styles.tabBarStyle,
        })}
      >
        <Tab.Screen name="Landing" component={LandingPage} />
        <Tab.Screen name="Search" component={SearchPage} />
        <Tab.Screen name="Favourites" component={FavouritesPage} />
        <Tab.Screen name="Notification" component={NotificationsPage} />
        <Tab.Screen name="Profile" component={ProfilePage} />
        <Tab.Screen name="FindActivity" component={FindActivity} />
        <Tab.Screen name="HostActivity" component={HostActivity} />
       <Tab.Screen name="FriendsList" component={FriendsList} />
       <Tab.Screen name="Schedule" component={Schedule} />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#2E2E2E', 
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, 
  },
});

export default AppTab;
