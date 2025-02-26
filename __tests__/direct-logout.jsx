import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Direct LogOut component for testing
export default function DirectLogout({ onLogout }) {
  const handlePress = () => {
    // Call the WebBrowser directly
    WebBrowser.openAuthSessionAsync('https://example.com/logout', 'myapp://');
    
    // Call the onLogout callback
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} testID="direct-logout-button">
        <Text>Direct Log Out</Text>
      </TouchableOpacity>
    </View>
  );
} 