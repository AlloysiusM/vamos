import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";

const LandingPage = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/Vamos2.jpg')} style={styles.logo} />

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* Card Buttons */}
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <TouchableOpacity onPress={() => navigation.navigate("EventActivities")}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>My Events</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("FriendsList")}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Friends</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Schedule")}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Schedule</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Near me</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  cardContainer: {
    marginTop: 30,
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
    width: 150,
    height: 150,
    borderRadius: 20,
    backgroundColor: '#FFF0C1',
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
