import 'react-native-reanimated';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./frontend/navigation/AuthNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
