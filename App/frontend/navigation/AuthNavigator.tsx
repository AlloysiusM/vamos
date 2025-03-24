import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LandingPage from "../screens/LandingPage";
import AppTab from "./AppTab";


export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  LandingPage: undefined;
  AppTab: undefined; 
};

const Stack = createStackNavigator(); 

const AuthNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
};

export default AuthNavigator;
