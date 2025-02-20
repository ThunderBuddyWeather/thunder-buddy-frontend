import React from 'react';
import { TouchableOpacity, Text, View, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  white: '#FFFFFF'
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 24,
    marginTop: 0,
    textAlign: 'center'
  }
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
          onPress={handleLogIn}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log In</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleLogIn}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text>Log In</Text>
      </Button>
    );
  };

  const LogOut = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          onPress={handleLogOut}
          className="bg-red-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Log Out</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={handleLogOut}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text>Log Out</Text>
      </Button>
    );
  };

  const Weather = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          onPress={navigateWeather}
          className="bg-blue-600 py-3 px-4 rounded mt-5"
        >
          <Text className="text-white text-center text-base">Weather</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Button
        mode="contained"
        onPress={navigateWeather}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        <Text>Weather</Text>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {username ? `Welcome, ${username}!` : 'Please log in!'}
        {'\n'}
        {username ? <LogOut /> : <LogIn />}
        {username ? <Weather /> : ''}
      </Text>
    </View>
  );
}
