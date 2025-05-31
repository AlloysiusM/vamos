import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { LinearGradient } from 'expo-linear-gradient';

const LandingPage = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/Vamos.jpg')} style={styles.logo} />

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* Card Buttons */}
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <TouchableOpacity onPress={() => navigation.navigate("EventActivities")}>
            <LinearGradient
              colors={['#b57e10', '#f9df7b', '#d8a90d']}
              style={styles.card}
            >
              <Text style={styles.cardLabel}>My Events</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Profile Button */}
          <TouchableOpacity onPress={() => navigation.navigate("FriendsList")}>
            <LinearGradient
              colors={['#b57e10', '#f9df7b', '#d8a90d']}
              style={styles.card}
            >
              <Text style={styles.cardLabel}>Friends</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardRow}>

          { /* Schedule Button */}
          <TouchableOpacity onPress={() => navigation.navigate("Schedule")}>
            <LinearGradient
              colors={['#b57e10', '#f9df7b', '#d8a90d']}
              style={styles.card}
            >
              <Text style={styles.cardLabel}>Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Near Me Button */}
          <TouchableOpacity onPress={() => navigation.navigate("FindMe")}> 
            <LinearGradient
              colors={['#b57e10', '#f9df7b', '#d8a90d']}
              style={styles.card}
            >
              <Text style={styles.cardLabel}>Near me</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  card: {
    width: 165,
    height: 165,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9A348',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 16,
    color: '#6B4C1E',
    fontWeight: '600',
  },
});

export default LandingPage;
