import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-native';
import React from 'react';
import Home from '../app/components/Home';
import { setupPlatformTests } from './utils/platformTestSetup';
import { renderWithProvider } from './utils/testUtils';

// Common test setup
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Platform-agnostic tests
  describe('Common Functionality', () => {
    it('renders login button when not logged in', () => {
      const { getByText } = renderWithProvider(<Home />);
      expect(getByText('Log In')).toBeTruthy();
    });

    it('renders welcome message with username when logged in', () => {
      const { getByText } = renderWithProvider(<Home />, { username: 'TestUser' });
      expect(getByText('Welcome, TestUser!')).toBeTruthy();
    });
  });

  // Run platform-specific tests
  setupPlatformTests({ mockNavigate });
});
