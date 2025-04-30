import 'react-native-reanimated';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./frontend/navigation/AuthNavigator";
import { EventProvider } from './frontend/states/contexts/EventContext';

export default function App() {
  return (
    <EventProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </EventProvider>
  );
}
