import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/components/Home';
import { UserProvider } from '../app/context/UserContext';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Home Component', () => {
  const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login button when not logged in', () => {
    const { getByText } = render(<Home />, { wrapper });
    const loginButton = getByText('Log In');
    expect(loginButton).toBeTruthy();
  });

  it('navigates to login screen when login button is pressed', () => {
    const { getByText } = render(<Home />, { wrapper });
    fireEvent.press(getByText('Log In'));
    expect(mockNavigate).toHaveBeenCalledWith('LogIn');
  });

  it('shows welcome message and logout button when logged in', () => {
    const { getByText, queryByText } = render(
      <UserProvider initialUsername="TestUser">
        <Home />
      </UserProvider>
    );

    // Check for username in the welcome text
    expect(getByText(/TestUser/)).toBeTruthy();

    // Check for logout button
    expect(getByText('Log Out')).toBeTruthy();

    // Weather button should be visible when logged in
    expect(getByText('Weather')).toBeTruthy();

    // Login button should not be visible
    expect(queryByText('Log In')).toBeNull();
  });
});
