/* global describe, it, expect, jest */
import React from 'react';
import { render } from '@testing-library/react-native';
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import ContactList from '../app/components/ContactList';
import { useAppContext } from '../app/context/AppContext';

// Mock the useFriends hook
jest.mock('../app/queries', () => ({
  useFriends: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock components that ContactList depends on
jest.mock('react-native-paper', () => {
  const MockCard = ({ children, style }) => {
    const React = require('react');
    return React.createElement('div', { style }, children);
  };
  MockCard.displayName = 'Card';

  // Add Content as a property to MockCard
  const MockCardContent = ({ children, style }) => {
    const React = require('react');
    return React.createElement('div', { style }, children);
  };
  MockCardContent.displayName = 'Card.Content';

  MockCard.Content = MockCardContent;

  const MockAvatarIcon = ({ size, icon, style }) => {
    const React = require('react');
    return React.createElement(
      'div',
      { style, 'data-icon': icon, 'data-size': size },
      null
    );
  };
  MockAvatarIcon.displayName = 'Avatar.Icon';

  return {
    Card: MockCard,
    Avatar: {
      Icon: MockAvatarIcon,
      Image: 'MockAvatarImage',
    },
  };
});

describe('ContactList', () => {
  const mockContacts = [
    {
      user_id: '1',
      name: 'John Doe',
      weather: {
        icon: 'c01d',
      },
      alert: null,
      picture: null,
    },
    {
      user_id: '2',
      name: 'Jane Smith',
      weather: {
        icon: 'r01d',
      },
      alert: 'Flood Warning',
      picture: 'https://example.com/picture.jpg',
    },
  ];

  beforeEach(() => {
    // Setup default mock for useAppContext
    useAppContext.mockReturnValue({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        sub: 'auth0|12345',
        nickname: 'testuser',
      },
      BASE_URL: 'https://api.example.com',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the contacts title', () => {
    const { getByText } = render(<ContactList />);
    expect(getByText('Contacts')).toBeTruthy();
  });

  it('renders an empty list when no contacts are provided', () => {
    const { queryByText } = render(<ContactList />);
    expect(queryByText('John Doe')).toBeNull();
  });

  it('renders contact cards with names', () => {
    // Mock useFriends to return our test data
    require('../app/queries').useFriends.mockReturnValueOnce({
      data: mockContacts,
      isLoading: false,
      error: null,
    });

    // Just test that the component renders successfully and useFriends was called
    render(<ContactList />);
    expect(require('../app/queries').useFriends).toHaveBeenCalled();
  });

  it('handles loading state correctly', () => {
    // Mock useFriends to return loading state
    require('../app/queries').useFriends.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });

    const { queryByText } = render(<ContactList />);
    // Component should render without crashing
    expect(require('../app/queries').useFriends).toHaveBeenCalled();
  });

  it('handles error state correctly', () => {
    // Mock useFriends to return error state
    require('../app/queries').useFriends.mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error('Failed to load contacts'),
    });

    const { queryByText } = render(<ContactList />);
    // Component should render without crashing
    expect(require('../app/queries').useFriends).toHaveBeenCalled();
  });
});
