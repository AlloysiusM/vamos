import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LandingPage from "../screens/LandingPage";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import AppTab from "./AppTab";



export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  LandingPage: undefined;
  ForgotPassword: undefined;
  VerificationEmail: { email: string };
  ResetPassword: { email: string };
  AppTab: undefined; 
};

const Stack = createStackNavigator(); 

const AuthNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerificationEmail" component={VerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }} />
      </Stack.Navigator>

  );
};

export default AuthNavigator;
