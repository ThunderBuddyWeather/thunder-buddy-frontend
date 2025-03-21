import React from 'react';
import { Button } from 'react-native-paper';
import { Text, View, Platform, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAppContext } from '../context/AppContext.jsx';
import styles from '../stylesheets/styles.js';

const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;

export default function LogOut() {
  const { setUser } = useAppContext();

  const handleLogout = async () => {
    setUser(null);

    const returnTo = Platform.OS === 'web'
      ? encodeURIComponent(window.location.origin)
      : encodeURIComponent('myapp://auth'); 

    const logoutUrl = `https://${AUTH_DOMAIN}/v2/logout?client_id=${CLIENT_ID}&returnTo=${returnTo}`;

    try {
      if (Platform.OS === 'web') {
        console.log("Logging out on web:", logoutUrl);
        window.location.href = logoutUrl;
      } else {
        console.log("Logging out on Expo:", logoutUrl);
        const result = await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
        console.log("Logout result on Expo:", result);

        if (result.type === 'success') {
          console.log("Logged out successfully on Expo");
        } else if (result.type === 'cancel') {
          console.warn("Logout was canceled on Expo");
        } else {
          console.warn("Logout flow failed or was closed", result);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <TouchableOpacity 
          onPress={handleLogout} 
          activeOpacity={0.7} 
          style={styles.button}
          testID="logout-button"
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      ) : (
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.button}
          labelStyle={styles.buttonText}
          testID="logout-button"
        >
          <Text>Log Out</Text>
        </Button>
      )}
    </View>
  );
}
