import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  test,
  expect,
} from '@jest/globals';
import ContactSearch from '../app/components/ContactSearch';

// Mock the AppContext
jest.mock('../app/context/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock components
jest.mock('react-native-paper', () => ({
  Card: 'MockCard',
  Avatar: {
    Image: 'MockAvatarImage',
    Icon: 'MockAvatarIcon',
  },
}));

// Default mocked context values
const mockContextValue = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    sub: 'auth0|12345',
    nickname: 'testuser',
  },
  BASE_URL: 'https://api.example.com',
};

describe('ContactSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the default mock implementation for useAppContext
    require('../app/context/AppContext').useAppContext.mockReturnValue(
      mockContextValue
    );

    // Set up the default fetch success response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Friend request sent!' }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { getByPlaceholderText } = render(<ContactSearch />);
    expect(getByPlaceholderText('Username')).toBeTruthy();
  });

  test('handles input changes', () => {
    const { getByPlaceholderText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'test');

    expect(input.props.value).toBe('test');
  });

  test('submits friend request when input is submitted', async () => {
    const { getByPlaceholderText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/friendship/request/testuser+friendname',
        { method: 'POST' }
      );
    });
  });

  test('does not submit when friend code is empty', async () => {
    const { getByPlaceholderText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, '   '); // Only whitespace
    fireEvent(input, 'submitEditing');

    // The fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows error when user is not logged in', async () => {
    // Mock the context to return no user
    require('../app/context/AppContext').useAppContext.mockReturnValue({
      ...mockContextValue,
      user: null,
    });

    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    const errorMessage = await findByText('No logged-in user found.');
    expect(errorMessage).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('shows success message on successful request', async () => {
    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    const successMessage = await findByText('Friend request sent!');
    expect(successMessage).toBeTruthy();
  });

  test('shows success checkmark on successful request', async () => {
    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    // Find the checkmark
    const checkmark = await findByText('✓');
    expect(checkmark).toBeTruthy();
  });

  test('shows error message when API request fails', async () => {
    // Mock a failed API response
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'User not found' }),
    });

    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'nonexistentuser');
    fireEvent(input, 'submitEditing');

    const errorMessage = await findByText('User not found');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: 'red' })])
    );
  });

  test('handles API network errors', async () => {
    // Mock a network error
    global.fetch.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    const errorMessage = await findByText('Network error');
    expect(errorMessage).toBeTruthy();
  });

  test('handles API errors with no specific message', async () => {
    // Mock a failed API response with no message
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    const errorMessage = await findByText('Failed to send friend request');
    expect(errorMessage).toBeTruthy();
  });

  test('handles network errors with no specific message', async () => {
    // Mock a network error with no message
    const error = new Error();
    error.message = undefined;
    global.fetch.mockRejectedValue(error);

    const { getByPlaceholderText, findByText } = render(<ContactSearch />);

    const input = getByPlaceholderText('Username');
    fireEvent.changeText(input, 'friendname');
    fireEvent(input, 'submitEditing');

    const errorMessage = await findByText('Something went wrong');
    expect(errorMessage).toBeTruthy();
  });
});
