import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogOut from '../app/components/LogOut';
import { useUser } from '../app/context/UserContext';

// Mock the Platform module
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios || obj.default)
}));

// Mock the UserContext
jest.mock('../app/context/UserContext', () => ({
  useUser: jest.fn().mockReturnValue({
    user: { name: 'Test User' },
    setUser: jest.fn()
  })
}));

describe('LogOut Component - Simple Test', () => {
  it('renders a logout button', () => {
    const { getByText } = render(<LogOut />);
    const logoutButton = getByText('Log Out');
    expect(logoutButton).toBeTruthy();
  });
  
  it('calls setUser with null when logout button is pressed', () => {
    // Get the mocked setUser function
    const mockSetUser = jest.fn();
    useUser.mockReturnValue({
      user: { name: 'Test User' },
      setUser: mockSetUser
    });
    
    // Render the component
    const { getByText } = render(<LogOut />);
    
    // Press the logout button
    const logoutButton = getByText('Log Out');
    fireEvent.press(logoutButton);
    
    // Verify setUser was called with null
    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
}); 