import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useUser } from '../app/context/UserContext';
import * as WebBrowser from 'expo-web-browser';
import { authDomain, clientId } from '../auth0-config';

// Mock implementation that matches the actual component
export default function LogOut() {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);

    const returnTo = Platform.OS === 'web'
      ? encodeURIComponent(window.location.origin)
      : encodeURIComponent('myapp://'); 

    const logoutUrl = `https://${authDomain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;

    try {
      if (Platform.OS === 'web') {
        window.location.href = logoutUrl;
      } else {
        WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
} 