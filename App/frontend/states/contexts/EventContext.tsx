import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Event {
  details: string;
  date: string;
  _id: string;
  title: string;
  startTime: number;
  endTime: number;
  location: string;
}

interface EventContextType {
  signedUpEvents: Event[];
  addSignedUpEvent: (event: Event) => void;
  removeSignedUpEvent: (eventId: string) => void;
  addFavoriteEvent: (event: Event) => void;
  removeFavoriteEvent: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  favoriteEvents: Event[];
  currentUserId: string | null;
  setCurrentUserId: (userId: string | null) => void;
  isLoading: boolean;
  clearUserData: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({
  signedUpEvents: [],
  addSignedUpEvent: () => {},
  removeSignedUpEvent: () => {},
  favoriteEvents: [],
  addFavoriteEvent: () => {},
  removeFavoriteEvent: () => {},
  isFavorite: () => false,
  currentUserId: null,
  setCurrentUserId: () => {},
  isLoading: true,
  clearUserData: async () => {},
});

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear all user data when logging out
  const clearUserData = async () => {
    setSignedUpEvents([]);
    setFavoriteEvents([]);
  };

  // Get storage key with user ID
  const getStorageKey = (baseKey: string) => {
    if (!currentUserId) throw new Error("No current user ID");
    return `${baseKey}_${currentUserId}`;
  };

  // Load events when userId changes
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      
      if (!currentUserId) {
        await clearUserData();
        setIsLoading(false);
        return;
      }

      try {
        const [signedUp, favorites] = await Promise.all([
          AsyncStorage.getItem(getStorageKey("signedUpEvents")),
          AsyncStorage.getItem(getStorageKey("favoriteEvents")),
        ]);

        setSignedUpEvents(signedUp ? JSON.parse(signedUp) : []);
        setFavoriteEvents(favorites ? JSON.parse(favorites) : []);
      } catch (error) {
        console.error("Error loading events:", error);
        await clearUserData();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [currentUserId]);

  const persistSignedUpEvents = async (events: Event[]) => {
    try {
      setSignedUpEvents(events);
      if (currentUserId) {
        await AsyncStorage.setItem(
          getStorageKey("signedUpEvents"), 
          JSON.stringify(events)
        );
      }
    } catch (error) {
      console.error("Failed to save signed up events:", error);
    }
  };

  const persistFavoriteEvents = async (events: Event[]) => {
    try {
      setFavoriteEvents(events);
      if (currentUserId) {
        await AsyncStorage.setItem(
          getStorageKey("favoriteEvents"), 
          JSON.stringify(events)
        );
      }
    } catch (error) {
      console.error("Failed to save favorite events:", error);
    }
  };

  const addSignedUpEvent = (event: Event) => {
    const updated = [...signedUpEvents, event];
    persistSignedUpEvents(updated);
  };

  const removeSignedUpEvent = (eventId: string) => {
    const updated = signedUpEvents.filter(e => e._id !== eventId);
    persistSignedUpEvents(updated);
  };

  const addFavoriteEvent = (event: Event) => {
    if (!favoriteEvents.some(e => e._id === event._id)) {
      const updated = [...favoriteEvents, event];
      persistFavoriteEvents(updated);
    }
  };

  const removeFavoriteEvent = (eventId: string) => {
    const updated = favoriteEvents.filter(e => e._id !== eventId);
    persistFavoriteEvents(updated);
  };

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
        currentUserId,
        setCurrentUserId,
        isLoading,
        clearUserData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);