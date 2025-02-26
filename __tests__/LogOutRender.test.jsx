import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import LogOut from '../app/components/LogOut';

// Mock the modules
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn(),
  dismissAuthSession: jest.fn(),
  maybeCompleteAuthSession: jest.fn()
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn()
  })
}));

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

// Mock auth0-config
jest.mock('../auth0-config', () => ({
  authDomain: 'test-domain.auth0.com',
  clientId: 'test-client-id'
}));

describe('LogOut Component - Render Test', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<LogOut />);
    expect(getByText('Log Out')).toBeTruthy();
  });
}); 