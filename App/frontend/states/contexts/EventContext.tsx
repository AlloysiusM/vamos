import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage for local data storage
import React, { createContext, useContext, useEffect, useState } from 'react';  // React hooks and context

// EventContext Structure
interface Event {
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
}

// setting values for the context
const EventContext = createContext<EventContextType>({
  signedUpEvents: [], 
  addSignedUpEvent: () => {}, 
  removeSignedUpEvent: () => {},  
});

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]); 

  // Load signed-up events from AsyncStorage when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      const stored = await AsyncStorage.getItem("signedUpEvents");  // Get stored events from AsyncStorage
      if (stored) {
        setSignedUpEvents(JSON.parse(stored)); 
      }
    };
    loadEvents(); 
  }, []);

  // Function to save the updated events to AsyncStorage
  const persistEvents = async (updatedEvents: Event[]) => {
    setSignedUpEvents(updatedEvents); 
    await AsyncStorage.setItem("signedUpEvents", JSON.stringify(updatedEvents));
  };

  // Function to add an event to the signed-up list
  const addSignedUpEvent = (event: Event) => {
    const updated = [...signedUpEvents, event];  
    persistEvents(updated);  
  };

  // Function to remove an event from the signed-up list
  const removeSignedUpEvent = (eventId: string) => {
    const updated = signedUpEvents.filter(e => e._id !== eventId); 
    persistEvents(updated); 
  };


  return (
    <EventContext.Provider value={{ signedUpEvents, addSignedUpEvent, removeSignedUpEvent }}>
      {children} 
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
