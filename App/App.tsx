import 'react-native-reanimated';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from 'react-native';
import AuthNavigator from "./frontend/navigation/AuthNavigator";
import { EventProvider } from './frontend/states/contexts/EventContext';

export default function App() {
  return (
    <EventProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </EventProvider>
  );
}
