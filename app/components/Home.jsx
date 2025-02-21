import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/COLORS';

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 24,
    marginTop: 0,
    textAlign: 'center',
  },
});

export default function Home() {
  const { username, setUsername } = useUser();
  const navigation = useNavigation();

  const handleLogIn = () => {
    navigation.navigate('LogIn');
  };

  const handleLogOut = () => {
    setUsername(null);
    navigation.navigate('Home');
  };

  const navigateWeather = () => {
    navigation.navigate('Weather');
  };

  const LogIn = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          testID="login-button"
          onPress={handleLogIn}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log In</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        testID="login-button"
        onPress={handleLogIn}
        style={{
          ...styles.button,
          backgroundColor: COLORS.secondary,
          contentStyle: { minWidth: 100 },
        }}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    );
  };

  const LogOut = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          testID="logout-button"
          onPress={handleLogOut}
          className="bg-red-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log Out</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        testID="logout-button"
        onPress={handleLogOut}
        style={{
          ...styles.button,
          backgroundColor: COLORS.danger, // Use theme color
          contentStyle: { minWidth: 100 },
        }}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    );
  };

  const Weather = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          testID="weather-button"
          onPress={navigateWeather}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Weather</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        testID="weather-button"
        onPress={navigateWeather}
        style={{
          ...styles.button,
          backgroundColor: COLORS.primary, // Use existing theme color
          contentStyle: { minWidth: 100 },
        }}
      >
        <Text style={styles.buttonText}>Weather</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {username ? `Welcome, ${username}!` : 'Please log in!'}
      </Text>
      {username ? (
        <>
          <LogOut />
          <Weather />
        </>
      ) : (
        <LogIn />
      )}
    </View>
  );
}
