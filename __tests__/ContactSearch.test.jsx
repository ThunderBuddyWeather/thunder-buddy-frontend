import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import ContactSearch from '../app/components/ContactSearch';
import { useAppContext } from '../app/context/AppContext';

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      sub: 'auth0|12345',
      nickname: 'testuser'
    },
    BASE_URL: 'https://api.example.com'
  }))
}));

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Success' })
  })
);

// Mock components
jest.mock('react-native-paper', () => ({
  Card: 'MockCard',
  Avatar: {
    Image: 'MockAvatarImage',
    Icon: 'MockAvatarIcon'
  }
}));

describe('ContactSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { getByPlaceholderText } = render(
      <ContactSearch 
        contacts={[
          { userId: '1', username: 'testuser', picture: null }
        ]} 
        myContacts={[]} 
      />
    );
    
    expect(getByPlaceholderText('Username')).toBeTruthy();
  });

  test('handles input changes', () => {
    const { getByPlaceholderText } = render(
      <ContactSearch contacts={[]} myContacts={[]} />
    );
    
    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'test');
    
    expect(input.props.value).toBe('test');
  });

  test('accepts contacts as props', () => {
    // This test verifies that the component accepts the contacts prop
    // without throwing errors
    const { getByPlaceholderText } = render(
      <ContactSearch 
        contacts={[
          { userId: '1', username: 'testuser', picture: null },
          { userId: '2', username: 'anotheruser', picture: 'https://example.com/pic.jpg' }
        ]} 
        myContacts={[]} 
      />
    );
    
    // Just verify it renders without errors
    expect(getByPlaceholderText('Username')).toBeTruthy();
  });
});