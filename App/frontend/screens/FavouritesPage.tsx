import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useEvents } from '../states/contexts/EventContext'; 

type EventItem = {
  _id: string;
  title: string;
  details: string;
  date: string;
};

const FavouritesPage = () => {
  const { favoriteEvents } = useEvents();

  const renderItem = ({ item }: { item: EventItem }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetail}>{item.details}</Text>
      <Text style={styles.eventDate}>📅 {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourites</Text>

      {favoriteEvents.length === 0 ? (
        <Text style={styles.empty}>You haven't added any favourites yet.</Text>
      ) : (
        <FlatList
          data={favoriteEvents.map((event) => ({
            _id: event._id,
            title: event.title,
            details: event.details ?? '',
            date: event.date ?? '',
          }))}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default FavouritesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B88A4E',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 20,
  },

  listContainer: {
    paddingBottom: 20,
  },

  eventCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },

  eventDetail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 6,
  },

  eventDate: {
    fontSize: 12,
    color: '#999999',
  },

  empty: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});