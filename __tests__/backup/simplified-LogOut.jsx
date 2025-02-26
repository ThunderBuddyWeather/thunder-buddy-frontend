import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Simplified LogOut component for testing
export default function SimplifiedLogOut({ setUser, authDomain, clientId }) {
  const handleLogout = () => {
    // Clear user data
    setUser(null);

    // Construct return URL
    const returnTo = Platform.OS === 'web'
      ? encodeURIComponent(window.location.origin)
      : encodeURIComponent('myapp://'); 

    // Construct logout URL
    const logoutUrl = `https://${authDomain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;

    try {
      if (Platform.OS === 'web') {
        // Web logout - redirect
        window.location.href = logoutUrl;
      } else {
        // Native logout - open browser
        // Use synchronous call for testing
        WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout} testID="logout-button">
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
} 