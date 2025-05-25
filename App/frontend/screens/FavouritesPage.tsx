import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../states/contexts/EventContext';

type EventItem = {
  _id: string;
  title: string;
  details: string;
  date: string;
};

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
  const { favoriteEvents } = useEvents();
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: EventItem }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetail}>{item.details}</Text>
      <Text style={styles.eventDate}>{formatDateTime(item.date)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Favourites</Text>

      {/* Events List or Empty Text */}
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
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 70, 
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
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

  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9df7b',
    marginBottom: 6,
  },

  eventDetail: {
    fontSize: 14,
    color: '#BDB298',
    marginBottom: 6,
  },

  eventDate: {
    fontSize: 12,
    color: '#888888',
  },

  empty: {
    color: '#BDB298',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
