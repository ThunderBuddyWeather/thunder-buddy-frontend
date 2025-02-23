import React from 'react';
import { TouchableOpacity, Text, View, Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext.jsx';
import { useNavigation } from '@react-navigation/native';
import Weather from './Weather.jsx';
import LogOut from './LogOut.jsx';

const COLORS = {
  white: '#FFFFFF'
};


export default function Home() {
  const { user, setUser } = useUser();
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: { fontSize: 16, color: COLORS.white, textAlign: 'center', fontFamily: 'Arial' },
});
