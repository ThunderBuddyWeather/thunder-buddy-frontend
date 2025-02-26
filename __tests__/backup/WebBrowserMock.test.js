import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create a mock function
const mockOpenAuthSessionAsync = jest.fn();

// Mock the module
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: mockOpenAuthSessionAsync,
  dismissAuthSession: jest.fn(),
  maybeCompleteAuthSession: jest.fn()
}));

// Import the module after mocking
const WebBrowser = require('expo-web-browser');

describe('WebBrowser Mock', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should mock openAuthSessionAsync correctly', () => {
    // Call the mocked function
    WebBrowser.openAuthSessionAsync('https://example.com', 'myapp://');
    
    // Verify it was called with the correct arguments
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith(
      'https://example.com', 
      'myapp://'
    );
  });
}); 