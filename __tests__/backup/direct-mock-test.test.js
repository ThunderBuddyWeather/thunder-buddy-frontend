import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as WebBrowser from 'expo-web-browser';

describe('Direct WebBrowser Mock Test', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should call the mocked openAuthSessionAsync function', () => {
    // Call the function
    WebBrowser.openAuthSessionAsync('https://example.com', 'myapp://');
    
    // Check if it was called
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith('https://example.com', 'myapp://');
  });

  it('should work with a direct function call', () => {
    // Define a function that uses WebBrowser
    function testFunction() {
      return WebBrowser.openAuthSessionAsync('https://test.com', 'test://');
    }
    
    // Call the function
    testFunction();
    
    // Check if the mock was called
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalled();
    expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith('https://test.com', 'test://');
  });
}); 