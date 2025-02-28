import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import ContactSearch from '../app/components/ContactSearch';
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';

// Mock react-native-paper components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const MockCard = ({ children, style }) => (
    <View style={style} testID="card">
      {children}
    </View>
  );
  MockCard.displayName = 'Card';

  MockCard.Content = ({ children, style }) => (
    <View style={style} testID="card-content">
      {children}
    </View>
  );
  MockCard.Content.displayName = 'Card.Content';

  const MockAvatar = ({ children }) => (
    <View testID="avatar">
      {children}
    </View>
  );
  MockAvatar.displayName = 'Avatar';

  MockAvatar.Image = ({ source, size }) => (
    <View testID="avatar-image" source={source} size={size} />
  );
  MockAvatar.Image.displayName = 'Avatar.Image';

  MockAvatar.Icon = ({ icon, size }) => (
    <View testID="avatar-icon" icon={icon} size={size} />
  );
  MockAvatar.Icon.displayName = 'Avatar.Icon';

  return {
    Card: MockCard,
    Avatar: MockAvatar
  };
});

// Sample test data
const mockContacts = [
  { userId: '1', username: 'alice', picture: 'https://example.com/alice.jpg' },
  { userId: '2', username: 'bob', picture: null },
  { userId: '3', username: 'charlie', picture: 'https://example.com/charlie.jpg' }
];

const mockMyContacts = [
  { userId: '3', username: 'charlie' } // Already a contact
];

describe('ContactSearch Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Rendering', () => {
    test('renders the search input correctly', () => {
      const { getByPlaceholderText } = render(
        <ContactSearch contacts={[]} myContacts={[]} />
      );
      
      expect(getByPlaceholderText('Enter username...')).toBeTruthy();
    });
    
    test('initially does not show any contacts', () => {
      const { queryByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      expect(queryByText('alice')).toBeNull();
      expect(queryByText('bob')).toBeNull();
      expect(queryByText('charlie')).toBeNull();
    });
  });

  // Search functionality tests
  describe('Search Functionality', () => {
    test('updates search query when typing', () => {
      const { getByPlaceholderText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'ali');
      
      expect(searchInput.props.value).toBe('ali');
    });
    
    test('filters contacts based on search query', () => {
      const { getByPlaceholderText, getByText, queryByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'ali');
      
      // Should find 'alice' but not 'bob' or 'charlie'
      expect(getByText('alice')).toBeTruthy();
      expect(queryByText('bob')).toBeNull();
      expect(queryByText('charlie')).toBeNull();
    });
    
    test('handles case insensitive search', () => {
      const { getByPlaceholderText, getByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'ALI');
      
      // Should still find 'alice' despite different case
      expect(getByText('alice')).toBeTruthy();
    });
    
    test('excludes contacts already in myContacts', () => {
      const { getByPlaceholderText, queryByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={mockMyContacts} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'char');
      
      // Should not find 'charlie' as it's already in myContacts
      expect(queryByText('charlie')).toBeNull();
    });
    
    test('shows "No contacts found" when search has no results', () => {
      const { getByPlaceholderText, getByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'nonexistent');
      
      expect(getByText('No contacts found')).toBeTruthy();
    });
    
    test('does not show contacts when search query is empty', () => {
      const { getByPlaceholderText, queryByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      
      // Type something and then delete it
      fireEvent.changeText(searchInput, 'a');
      expect(queryByText('alice')).toBeTruthy();
      
      fireEvent.changeText(searchInput, '');
      
      expect(queryByText('alice')).toBeNull();
    });
    
    test('handles whitespace in search query', () => {
      const { getByPlaceholderText, queryByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      
      // Search with whitespace only
      fireEvent.changeText(searchInput, '   ');
      
      expect(queryByText('alice')).toBeNull();
      expect(queryByText('bob')).toBeNull();
    });
  });

  // Friend Request functionality tests
  describe('Friend Request Functionality', () => {
    test('sends friend request when button is pressed', async () => {
      const mockOnSendFriendRequest = jest.fn();
      
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <ContactSearch 
          contacts={mockContacts} 
          myContacts={[]} 
          onSendFriendRequest={mockOnSendFriendRequest} 
        />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'alice');
      
      const addButton = getByText('+').parent;
      fireEvent.press(addButton);
      
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      expect(mockOnSendFriendRequest).toHaveBeenCalledWith('1');
      expect(mockOnSendFriendRequest).toHaveBeenCalledTimes(1);
    });
    
    test('friend request button changes to checkmark after successful request', async () => {
      const { getByPlaceholderText, queryByText, getAllByTestId } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      await act(async () => {
        fireEvent.changeText(searchInput, 'alice');
      });
      
      // Find and press the button
      const addButton = getAllByTestId('friend-button')[0];
      await act(async () => {
        fireEvent.press(addButton);
        jest.advanceTimersByTime(1500);
      });
      
      // Should now show "✓" instead of "+"
      expect(queryByText('+')).toBeNull();
      const checkmarks = getAllByTestId('friend-button-text');
      expect(checkmarks[0].children[0]).toBe('✓');
    });
    
    test('friend request button is disabled during request', async () => {
      const { getByPlaceholderText, getAllByTestId } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      await act(async () => {
        fireEvent.changeText(searchInput, 'alice');
      });
      
      // Find and press the button
      const addButton = getAllByTestId('friend-button')[0];
      await act(async () => {
        fireEvent.press(addButton);
      });
      
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });
    
    test('friend request button remains disabled after successful request', async () => {
      const { getByPlaceholderText, getAllByTestId } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      await act(async () => {
        fireEvent.changeText(searchInput, 'alice');
      });
      
      // Find and press the button
      const addButton = getAllByTestId('friend-button')[0];
      await act(async () => {
        fireEvent.press(addButton);
        jest.advanceTimersByTime(1500);
      });
      
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });
    
    test('handles case when onSendFriendRequest is not provided', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'alice');
      
      // Find and press the button
      const addButton = getAllByText('+')[0].parent;
      
      // Should not throw when pressing the button without onSendFriendRequest prop
      expect(() => {
        fireEvent.press(addButton);
        act(() => {
          jest.advanceTimersByTime(1500);
        });
      }).not.toThrow();
    });
    
    test('handles error during friend request and resets after timeout', async () => {
      const mockOnSendFriendRequest = jest.fn(() => Promise.reject(new Error('Request failed')));
      
      const { getByPlaceholderText, getAllByTestId } = render(
        <ContactSearch 
          contacts={mockContacts} 
          myContacts={[]} 
          onSendFriendRequest={mockOnSendFriendRequest}
        />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      await act(async () => {
        fireEvent.changeText(searchInput, 'alice');
      });
      
      // Find and press the button
      const addButton = getAllByTestId('friend-button')[0];
      await act(async () => {
        fireEvent.press(addButton);
      });
      
      // Button should be disabled during the error state
      expect(addButton.props.accessibilityState.disabled).toBe(true);
      
      // Fast-forward the error timeout
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      // Button should be enabled again after error timeout
      expect(addButton.props.accessibilityState.disabled).toBe(false);
    });
  });

  // Avatar rendering tests
  describe('Avatar Rendering', () => {
    test('renders Avatar.Image when contact has a picture', () => {
      const { getByPlaceholderText, getByTestId } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'ali');
      
      const avatarImage = getByTestId('avatar-image');
      expect(avatarImage.props.source.uri).toBe('https://example.com/alice.jpg');
      expect(avatarImage.props.size).toBe(48);
    });
    
    test('renders Avatar.Icon when contact has no picture', () => {
      const { getByPlaceholderText, getByTestId } = render(
        <ContactSearch contacts={mockContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'bob');
      
      const avatarIcon = getByTestId('avatar-icon');
      expect(avatarIcon.props.icon).toBe('account');
      expect(avatarIcon.props.size).toBe(48);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('handles empty contacts array', () => {
      const { getByPlaceholderText, getByText } = render(
        <ContactSearch contacts={[]} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'test');
      
      expect(getByText('No contacts found')).toBeTruthy();
    });
    
    test('handles undefined myContacts prop', () => {
      const { getByPlaceholderText, getByText } = render(
        <ContactSearch contacts={mockContacts} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'alice');
      
      // Should still find alice
      expect(getByText('alice')).toBeTruthy();
    });
    
    test('handles multiple search results correctly', () => {
      const multipleContacts = [
        ...mockContacts,
        { userId: '4', username: 'alicia', picture: null }
      ];
      
      const { getByPlaceholderText, getByText } = render(
        <ContactSearch contacts={multipleContacts} myContacts={[]} />
      );
      
      const searchInput = getByPlaceholderText('Enter username...');
      fireEvent.changeText(searchInput, 'ali');
      
      // Should find both 'alice' and 'alicia'
      expect(getByText('alice')).toBeTruthy();
      expect(getByText('alicia')).toBeTruthy();
    });
  });
});