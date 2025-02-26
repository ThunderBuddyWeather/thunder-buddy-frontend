import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create a mock function
const mockOpenAuthSessionAsync = jest.fn();

// Mock the module
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: mockOpenAuthSessionAsync,
  dismissAuthSession: jest.fn(),
  maybeCompleteAuthSession: jest.fn()
}));

// Import the module after mocking using require
const WebBrowser = require('expo-web-browser');

describe('WebBrowser Mock Verification', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('correctly mocks the WebBrowser.openAuthSessionAsync function', () => {
    // Call the mocked function
    WebBrowser.openAuthSessionAsync('https://example.com', 'myapp://');
    
    // Verify it was called
    expect(mockOpenAuthSessionAsync).toHaveBeenCalled();
    expect(mockOpenAuthSessionAsync).toHaveBeenCalledWith('https://example.com', 'myapp://');
  });
}); 