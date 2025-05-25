import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage for local data storage
import React, { createContext, useContext, useEffect, useState } from 'react';  // React hooks and context

// EventContext Structure
interface Event {
  details: string;
  date: string;
  _id: string;
  title: string;
  startTime: number;
  endTime: number;
  location: string;
}

// defining the context type for the EventContext
interface EventContextType {
  signedUpEvents: Event[];
  addSignedUpEvent: (event: Event) => void;
  removeSignedUpEvent: (eventId: string) => void;
  addFavoriteEvent: (event: Event) => void;
  removeFavoriteEvent: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  favoriteEvents: Event[];
}

// setting values for the context
const EventContext = createContext<EventContextType>({
  signedUpEvents: [],
  addSignedUpEvent: () => {},
  removeSignedUpEvent: () => {},

  favoriteEvents: [],
  addFavoriteEvent: () => {},
  removeFavoriteEvent: () => {},
  isFavorite: () => false,
});

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  // Load signed-up and favorite events from AsyncStorage when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedSignedUp = await AsyncStorage.getItem("signedUpEvents");  // Get signed up events from AsyncStorage
        if (storedSignedUp) {
          setSignedUpEvents(JSON.parse(storedSignedUp));
        }

        const storedFavorites = await AsyncStorage.getItem("favoriteEvents");  // Get favorite events from AsyncStorage
        if (storedFavorites) {
          setFavoriteEvents(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading events from storage:", error);
      }
    };
    loadEvents();
  }, []);

  // Function to save the updated signed-up events to AsyncStorage
  const persistSignedUpEvents = async (updatedEvents: Event[]) => {
    setSignedUpEvents(updatedEvents);
    await AsyncStorage.setItem("signedUpEvents", JSON.stringify(updatedEvents));
  };

  // Function to save the updated favorite events to AsyncStorage
  const persistFavoriteEvents = async (updatedFavorites: Event[]) => {
    setFavoriteEvents(updatedFavorites);
    await AsyncStorage.setItem("favoriteEvents", JSON.stringify(updatedFavorites));
  };

  // Function to add an event to the signed-up list
  const addSignedUpEvent = (event: Event) => {
    const updated = [...signedUpEvents, event];
    persistSignedUpEvents(updated);
  };

  // Function to remove an event from the signed-up list
  const removeSignedUpEvent = (eventId: string) => {
    const updated = signedUpEvents.filter(e => e._id !== eventId);
    persistSignedUpEvents(updated);
  };

  // Function to add an event to the favorites list
  const addFavoriteEvent = (event: Event) => {
    const updated = [...favoriteEvents, event];
    persistFavoriteEvents(updated);
  };

  // Function to remove an event from the favorites list
  const removeFavoriteEvent = (eventId: string) => {
    const updated = favoriteEvents.filter(e => e._id !== eventId);
    persistFavoriteEvents(updated);
  };

  // Function to check if an event is in the favorites list
  const isFavorite = (eventId: string) => {
    return favoriteEvents.some(e => e._id === eventId);
  };

  return (
    <EventContext.Provider
      value={{
        signedUpEvents,
        addSignedUpEvent,
        removeSignedUpEvent,

        favoriteEvents,
        addFavoriteEvent,
        removeFavoriteEvent,
        isFavorite,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
