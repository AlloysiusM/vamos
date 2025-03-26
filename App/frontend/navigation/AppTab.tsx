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

// nav stack type
export type RootStackParamList = {
  Landing: undefined;
  Search: undefined;
  Favourites: undefined;
  Notification: undefined;
  Profile: undefined;
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
        <Tab.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={SearchPage} options={{ headerShown: false }}/>
        <Tab.Screen name="Favourites" component={FavouritesPage} options={{ headerShown: false }}/>
        <Tab.Screen name="Notification" component={NotificationsPage} options={{ headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }}/>
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
