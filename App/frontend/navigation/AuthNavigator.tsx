import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LandingPage from "../screens/LandingPage";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import FriendsListScreen from "../screens/FriendsListScreen"
import ScheduleScreen from "../screens/ScheduleScreen";
import AppTab from "./AppTab";
import EventActivities from "../screens/EventActivitiesScreen";
import CreateEvent from "../screens/EventActivitiesCreationScreen";
import ProfilePage from "../screens/ProfilePage";
import AddFriendsScreen from "../screens/AddFriendsScreen";



export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  LandingPage: undefined;
  ForgotPassword: undefined;
  VerificationEmail: { email: string };
  ResetPassword: { email: string };
  AppTab: undefined; 
  EventActivities: undefined;
  FriendsList: undefined;
  Schedule: undefined;
  CreateEvent: undefined;
  Profile: undefined;
  AddFriend: undefined;
};

const Stack = createStackNavigator(); 

const AuthNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerificationEmail" component={VerificationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }} />
        <Stack.Screen name="EventActivities" component={EventActivities} options={{ headerShown: false }} />
        <Stack.Screen name="FriendsList" component={FriendsListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }} />

        <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
        <Stack.Screen name="AddFriend" component={AddFriendsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
};

export default AuthNavigator;
