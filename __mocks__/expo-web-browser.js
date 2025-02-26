// Mock implementation of expo-web-browser
import { jest } from '@jest/globals';

const openAuthSessionAsync = jest.fn().mockResolvedValue({ type: 'success' });
const dismissAuthSession = jest.fn();
const maybeCompleteAuthSession = jest.fn();

module.exports = {
  openAuthSessionAsync,
  dismissAuthSession,
  maybeCompleteAuthSession
}; 