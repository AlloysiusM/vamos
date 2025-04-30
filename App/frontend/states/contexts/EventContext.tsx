import React, { createContext, useContext, useState } from 'react';

interface Event {
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
}

const EventContext = createContext<EventContextType>({
  signedUpEvents: [],
  addSignedUpEvent: () => {},
  removeSignedUpEvent: () => {},
});

export const EventProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [signedUpEvents, setSignedUpEvents] = useState<Event[]>([]);

  const addSignedUpEvent = (event: Event) => {
    setSignedUpEvents(prev => [...prev, event]);
  };

  const removeSignedUpEvent = (eventId: string) => {
    setSignedUpEvents(prev => prev.filter(e => e._id !== eventId));
  };

  return (
    <EventContext.Provider value={{ signedUpEvents, addSignedUpEvent, removeSignedUpEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);