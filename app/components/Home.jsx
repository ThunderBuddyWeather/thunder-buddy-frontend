import React from 'react';
import { TouchableOpacity, Text, View, Platform} from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';
import Weather from './Weather.jsx';
import LogOut from './LogOut.jsx';
import styles from '../stylesheets/styles.js';

export default function Home() {
  const { user} = useUser();
  const navigation = useNavigation();

  const handleLogIn = () => {
    navigation.navigate('LogIn');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user ? `Welcome, ${user.name}!` : 'Please log in!'}
        {'\n'}
        {user ? <Weather /> : ''}
        {'\n'}
        {user ? <LogOut /> : <LogIn />}
      </Text>
    </View>
  );
}