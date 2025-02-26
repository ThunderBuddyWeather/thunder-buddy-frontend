import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

// Create a mock function
const mockWebBrowserFunction = jest.fn();

// Mock the module
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: mockWebBrowserFunction
}));

// Create a super simple component that uses the WebBrowser
function SuperSimpleButton() {
  const handlePress = () => {
    // Import the module inside the component to ensure it uses the mock
    const WebBrowser = require('expo-web-browser');
    WebBrowser.openAuthSessionAsync('https://example.com', 'myapp://');
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} testID="simple-button">
        <Text>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('Super Simple Test', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('calls WebBrowser.openAuthSessionAsync when button is pressed', () => {
    // Render the component
    const { getByTestId } = render(<SuperSimpleButton />);
    
    // Get the button
    const button = getByTestId('simple-button');
    
    // Press the button
    fireEvent.press(button);
    
    // Log the mock calls to debug
    console.log('Mock calls:', mockWebBrowserFunction.mock.calls);
    
    // Verify the function was called
    expect(mockWebBrowserFunction).toHaveBeenCalled();
    expect(mockWebBrowserFunction).toHaveBeenCalledWith('https://example.com', 'myapp://');
  });
}); 