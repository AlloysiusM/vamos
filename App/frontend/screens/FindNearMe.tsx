import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NearMeScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Gym');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const webViewRef = useRef<any>(null);

  const API_KEY = GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const injectedHTML = location
    ? `<!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places"></script>
        <script>
          let map;
          let userMarker;
          let markers = {};

          function initMap() {
            const userLocation = { lat: ${location.latitude}, lng: ${location.longitude} };
            map = new google.maps.Map(document.getElementById('map'), {
              center: userLocation,
              zoom: 14
            });

            userMarker = new google.maps.Marker({
              position: userLocation,
              map: map,
              title: "You are here",
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: userLocation,
              radius: 3000,
              keyword: '${category}'
            }, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                const formattedResults = results.map(place => ({
                  place_id: place.place_id,
                  name: place.name,
                  vicinity: place.vicinity || '',
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }));

                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PLACES', data: formattedResults }));

                results.forEach(place => {
                  const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                  });
                  markers[place.place_id] = marker;
                });
              }
            });
          }

          function focusMarker(placeId) {
            const marker = markers[placeId];
            if (marker) {
              map.panTo(marker.getPosition());
              map.setZoom(17);
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(() => marker.setAnimation(null), 1400);
            }
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>`
    : '<Text>Loading map...</Text>';

  const onMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'PLACES') {
        setPlaces(message.data);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView', error);
    }
  };

  const handlePlacePress = (placeId: string) => {
    setSelectedPlaceId(placeId);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        focusMarker("${placeId}");
        true;
      `);
    }
  };

  const openCategoryModal = () => {
    setModalVisible(true);
  };

  const closeCategoryModal = () => {
    setModalVisible(false);
  };

  const selectCategory = (category: string) => {
    setCategory(category);
    closeCategoryModal();
  };

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f9df7b" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Find Near Me</Text>
        
        <View style={{ width: 34 + 10 }} />
      </View>
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: injectedHTML }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={onMessage}
        />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for facilities..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity onPress={openCategoryModal} style={styles.categoryButton}>
        <Text style={styles.categoryText}>Select Category: {category}</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.placeItem, selectedPlaceId === item.place_id && styles.selectedItem]}
            onPress={() => handlePlacePress(item.place_id)}
          >
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeVicinity}>{item.vicinity}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeCategoryModal}
      >
        <TouchableWithoutFeedback onPress={closeCategoryModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select a Category</Text>
                {['Gym', 'Football', 'Basketball', 'Swimming', 'Tennis', 'Yoga'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => selectCategory(cat)}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  searchInput: {
    height: 50,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#f9df7b',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#BDB298',
  },
  categoryButton: {
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 16,
    color: '#f9df7b',
  },
  placeItem: {
    padding: 15,
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111111',
  },
  selectedItem: {
    backgroundColor: '#444',
  },
  placeName: {
    fontSize: 18,
    color: '#f9df7b',
    fontWeight: 'bold',
  },
  placeVicinity: {
    fontSize: 14,
    color: '#BDB298',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: '#f9df7b',
    marginBottom: 15,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalOptionText: {
    color: '#f9df7b',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 34, 
    justifyContent: 'center',
    paddingRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9df7b',
    textAlign: 'center',
  },
});

export default NearMeScreen;
