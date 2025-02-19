import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '../_layout';

// Mock expo-router's Stack component
jest.mock('expo-router', () => ({
  Stack: () => null,
}));

describe('RootLayout Component', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toMatchSnapshot();
  });
});