import React from 'react';
import { render, act } from '@testing-library/react-native';
import Social from '../app/components/Social';
import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';

// Mock the child components
jest.mock('../app/components/ContactList', () => {
  const MockContactList = ({ contacts }) => (
    <mock-contact-list testID="contact-list" contacts={contacts} />
  );
  return MockContactList;
});

jest.mock('../app/components/ContactSearch', () => {
  const MockContactSearch = ({ contacts, myContacts, onSendFriendRequest }) => (
    <mock-contact-search
      testID="contact-search"
      contacts={contacts}
      myContacts={myContacts}
      onSendFriendRequest={onSendFriendRequest}
    />
  );
  return MockContactSearch;
});

describe('Social Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    const { getByText } = render(<Social />);
    expect(getByText('Loading contacts...')).toBeTruthy();
  });

  test('renders social hub title after loading', async () => {
    const { getByText } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(getByText('Social Hub')).toBeTruthy();
  });

  test('renders ContactSearch and ContactList components after loading', async () => {
    const { getByTestId } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    expect(getByTestId('contact-search')).toBeTruthy();
    expect(getByTestId('contact-list')).toBeTruthy();
  });

  test('passes correct props to ContactSearch', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactSearch = root.findByType('mock-contact-search');
    expect(contactSearch.props.contacts).toHaveLength(4);
    expect(contactSearch.props.myContacts).toEqual([]);
    expect(typeof contactSearch.props.onSendFriendRequest).toBe('function');
  });

  test('passes correct props to ContactList', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactList = root.findByType('mock-contact-list');
    expect(contactList.props.contacts).toEqual([]);
  });

  test('handles friend request correctly', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactSearch = root.findByType('mock-contact-search');
    
    // Add a friend
    await act(async () => {
      contactSearch.props.onSendFriendRequest('test1');
    });

    const contactList = root.findByType('mock-contact-list');
    expect(contactList.props.contacts).toHaveLength(1);
    expect(contactList.props.contacts[0].userId).toBe('test1');
  });

  test('handles duplicate friend requests', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactSearch = root.findByType('mock-contact-search');
    
    // Add the same friend twice
    await act(async () => {
      contactSearch.props.onSendFriendRequest('test1');
      contactSearch.props.onSendFriendRequest('test1');
    });

    const contactList = root.findByType('mock-contact-list');
    expect(contactList.props.contacts).toHaveLength(2);
    expect(contactList.props.contacts[0].userId).toBe('test1');
    expect(contactList.props.contacts[1].userId).toBe('test1');
  });

  test('handles invalid friend request gracefully', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactSearch = root.findByType('mock-contact-search');
    
    // Try to add a non-existent friend
    await act(async () => {
      contactSearch.props.onSendFriendRequest('invalid-id');
    });

    const contactList = root.findByType('mock-contact-list');
    expect(contactList.props.contacts).toHaveLength(0);
  });

  test('handles multiple friend requests correctly', async () => {
    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });

    const contactSearch = root.findByType('mock-contact-search');
    
    // Add multiple friends
    await act(async () => {
      contactSearch.props.onSendFriendRequest('test1');
      contactSearch.props.onSendFriendRequest('test2');
    });

    const contactList = root.findByType('mock-contact-list');
    expect(contactList.props.contacts).toHaveLength(2);
    expect(contactList.props.contacts[0].userId).toBe('test1');
    expect(contactList.props.contacts[1].userId).toBe('test2');
  });

  test('handles error during contacts fetch', async () => {
    // Mock console.error to prevent error output during test
    const originalError = console.error;
    console.error = jest.fn();

    // Force the useEffect to throw an error
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    const { UNSAFE_root: root } = render(<Social />);
    
    await act(async () => {
      try {
        jest.advanceTimersByTime(1500);
      } catch (e) {
        // Ignore the error as we're testing error handling
      }
    });

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching full contacts:',
      expect.any(Error)
    );

    // Verify the component shows empty state
    const contactSearch = root.findByType('mock-contact-search');
    const contactList = root.findByType('mock-contact-list');
    expect(contactSearch.props.contacts).toEqual([]);
    expect(contactList.props.contacts).toEqual([]);

    // Restore console.error
    console.error = originalError;
  });
}); 