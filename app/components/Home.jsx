import React from 'react';
import { Text, View} from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';
import Weather from './Weather.jsx';
import LogOut from './LogOut.jsx';
import styles from '../stylesheets/styles.js';

export default function Home() {
  const { user } = useUser();
  const navigation = useNavigation();

  const handleLogIn = () => {
    navigation.navigate('LogIn');
  };

  const LogIn = () => (
    <Button
      mode="contained"
      onPress={handleLogIn}
      style={styles.button}
      labelStyle={styles.buttonText}
    >
      <Text>Log In</Text>
    </Button>
  );

  return (
    <View style={styles.container} testID="home-container">
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {user ? `Welcome, ${user.name}!` : 'Please log in!'}
        </Text>
        {user ? <Weather /> : null}
      </View>

      {user ? <LogOut /> : <LogIn />}
    </View>
  );
}
