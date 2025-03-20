import React from 'react';
import { render } from '@testing-library/react-native';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import Social from '../app/components/Social';
import { useAppContext } from '../app/context/AppContext';

// Mock the dependencies
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn()
}));

jest.mock('../app/components/ContactList', () => 'MockContactList');
jest.mock('../app/components/ContactSearch', () => 'MockContactSearch');
jest.mock('../app/components/LogOut', () => 'MockLogOut');

describe('Social Component', () => {
  beforeEach(() => {
    useAppContext.mockReturnValue({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        sub: 'auth0|12345'
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user greeting when user is present', () => {
    const { getByText } = render(<Social />);
    expect(getByText('Welcome, Test User!')).toBeTruthy();
  });

  it('renders login message when user is not present', () => {
    // Mock user as null
    useAppContext.mockReturnValueOnce({
      user: null
    });

    const { getByText } = render(<Social />);
    expect(getByText('Please log in!')).toBeTruthy();
  });
}); 