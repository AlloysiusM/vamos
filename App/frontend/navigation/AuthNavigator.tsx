import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LandingPage from "../screens/LandingPage";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";


export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  LandingPage: undefined;
  ForgotPassword: undefined;
  VerificationEmail: { email: string };
  ResetPassword: { email: string };
};

const Stack = createStackNavigator(); 

const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerificationEmail" component={VerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
