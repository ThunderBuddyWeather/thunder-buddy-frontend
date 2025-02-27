import React,{useEffect} from 'react';
import { Text, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppContext } from '../context/AppContext.jsx';
import { useNavigation } from '@react-navigation/native';
import WeatherCard from './WeatherCard.jsx';
import AlertCard from './AlertCard.jsx';
import LogOut from './LogOut.jsx';
import styles from '../stylesheets/styles.js';

export default function Home() {
  const { user } = useAppContext();
  const navigation = useNavigation();

  const handleLogIn = () => {
    navigation.navigate('LogIn');
  };

  useEffect(() => {
    console.log('user', user)
    if(!user){
      navigation.navigate('LogIn')
      console.log('redirecting to login...')
    }
  }, [user, navigation])

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
    <SafeAreaView style={{ flex: 1 }} testID="home-container">
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
          justifyContent: 'flex-start',
        }}
      >
        <Text style={styles.title}>
          {user ? `Welcome, ${user.name}!` : 'Please log in!'}
        </Text>
        {user && <AlertCard />}
        {user && <WeatherCard />}
      </ScrollView>
      {user ? <LogOut /> : <LogIn />}
    </SafeAreaView>
  );
}
