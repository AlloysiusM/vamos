import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthNavigator"; 
import { LinearGradient } from 'expo-linear-gradient';

const LandingPage = () => {
    //add page routs and other functions 
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

      return (
        
        <View style={styles.container}>
          <Image source={require('../assets/Vamos2.jpg')} style={styles.logo} />
          <View style={styles.buttonContainer}>
             <LinearGradient
              colors={['#6f6f73', '#5f6062', '#ffffff', '#b4b4b9', '#727176']} //silver shades for gradient
                style={styles.button}
                >
              <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => navigation.navigate("EventActivities")}
              >
                  <Text style={styles.buttonText}>My Events</Text>
              </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
              colors={['#6f6f73', '#5f6062', '#ffffff', '#b4b4b9', '#727176']} //silver shades for gradient
                style={styles.button}
                >
              <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => navigation.navigate("FriendsList")}
              >
                  <Text style={styles.buttonText}>Friends List</Text>
              </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
              colors={['#6f6f73', '#5f6062', '#ffffff', '#b4b4b9', '#727176']} //silver shades for gradient
                style={styles.button}
                >
              <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => navigation.navigate("Schedule")}
              >
                  <Text style={styles.buttonText}>Schedule</Text>
              </TouchableOpacity>
              </LinearGradient>
              
              
              
              
              

              
              
          
          </View>
      </View>
  );
};
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000', 
        paddingHorizontal: 20,
        paddingVertical: 30,
      },
    
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#B88A4E',
        letterSpacing: 1,
      },
    
      inputContainer: {
        width: '100%',
        marginBottom: 20,
      },
    
      inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C9D3DB', 
        marginBottom: 8,
      },
    
      input: {
        height: 50,
        backgroundColor: '#1E1E1E', 
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: '500',
        width: '100%',
        color: '#C9D3DB', 
        borderWidth: 1,
        borderColor: '#444',
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 5,
        elevation: 3, 
      },
    
      button: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
      },
    
      buttonText: {
        color: '#1E1E1E',
        fontSize: 18,
        fontWeight: '600',
      },
    
      secondaryButton: {
        marginTop: 20,
        paddingVertical: 12,
      },
    
      secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#B88A4E',
      },

      buttonContainer: {
        width: '100%',
        alignItems: 'center',
      },
      
      logo: {
      width: 250,         
      height: 150,       
      //resizeMode: 'contain',
      marginTop: 20,      
      marginBottom: 20,   
      //alignSelf: 'center',
    },
});

export default LandingPage;