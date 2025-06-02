import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useEvents } from '../states/contexts/EventContext';

// Ts Decleration
type EventItem = {
  _id: string;
  title: string;
  details: string;
  date: string;
  startTime: number;
  endTime: number;
  location: string;
};

// Function to format date and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const FavouritesPage = () => {
  const { 
    favoriteEvents, 
    removeFavoriteEvent,
    currentUserId,
    isLoading
  } = useEvents();

  // remove fav
  const handleRemoveFavorite = (eventId: string) => {
    removeFavoriteEvent(eventId);
  };

  // show fav item
  const renderItem = ({ item }: { item: EventItem }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <TouchableOpacity 
          onPress={() => handleRemoveFavorite(item._id)}
          style={styles.favoriteButton}
        >
          <Text style={styles.favoriteButtonText}>★</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.eventDetail}>{item.details}</Text>
      <Text style={styles.eventDate}>{formatDateTime(item.date)}</Text>
      {item.location && (
        <Text style={styles.eventLocation}>📍 {item.location}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f9df7b" />
      </View>
    );
  }

  if (!currentUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Please sign in to view your favorites</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourites</Text>

      {favoriteEvents.length === 0 ? (
        <Text style={styles.empty}>You haven't added any favourites yet.</Text>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 70, 
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f9df7b',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9df7b',
    flex: 1,
  },
  eventDetail: {
    fontSize: 14,
    color: '#BDB298',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  empty: {
    color: '#BDB298',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    color: '#f9df7b',
    fontSize: 20,
  },
});

export default FavouritesPage;