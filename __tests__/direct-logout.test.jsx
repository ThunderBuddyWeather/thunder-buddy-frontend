import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DirectLogout from './direct-logout';
import * as WebBrowser from 'expo-web-browser';

// No need to mock WebBrowser here as we're using the mock from __mocks__/expo-web-browser.js

describe('DirectLogout Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('calls WebBrowser.openAuthSessionAsync when button is pressed', () => {
    // Mock the onLogout callback
    const mockOnLogout = jest.fn();
    
    // Render the component
    const { getByTestId } = render(<DirectLogout onLogout={mockOnLogout} />);
    
    // Get the button
    const button = getByTestId('direct-logout-button');
    
    // Press the button
    fireEvent.press(button);
    
    // Verify WebBrowser.openAuthSessionAsync was called
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(
      'https://example.com/logout', 
      'myapp://'
    );
    
    // Verify onLogout was called
    expect(mockOnLogout).toHaveBeenCalled();
  });
}); 