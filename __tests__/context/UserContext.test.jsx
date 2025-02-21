import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { UserProvider, useUser } from '../../app/context/UserContext';
import { Text } from 'react-native';
import { jest } from '@jest/globals';

// Test component that uses the useUser hook
const TestComponent = () => {
  const { username, setUsername } = useUser();
  return (
    <>
      <Text testID="username">{username || 'no user'}</Text>
      <Text testID="set-user" onPress={() => setUsername('test-user')}>
        Set User
      </Text>
    </>
  );
};

describe('UserContext', () => {
  it('provides initial null username when no initialUsername is provided', () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(getByTestId('username').props.children).toEqual(['no user']);
  });

  it('provides initialUsername when provided', () => {
    const { getByTestId } = render(
      <UserProvider initialUsername="initial-user">
        <TestComponent />
      </UserProvider>
    );

    expect(getByTestId('username').props.children).toEqual(['initial-user']);
  });

  it('updates username using setUsername', () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Verify initial state
    expect(getByTestId('username').props.children).toEqual(['no user']);

    // Update username
    act(() => {
      getByTestId('set-user').props.onPress();
    });

    // Verify updated state
    expect(getByTestId('username').props.children).toEqual(['test-user']);
  });

  it('throws error when useUser is used outside of UserProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUser must be used within a UserProvider');

    consoleSpy.mockRestore();
  });
});
