import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Index from '../index';

describe('Index Component', () => {
  it('renders correctly', () => {
    render(<Index />);
    
    const textElement = screen.getByText('Edit app/index.tsx to edit this screen.');
    expect(textElement).toBeTruthy();
  });

  it('has correct styles applied', () => {
    const { getByTestId } = render(<Index />);
    
    // Add testID to the View in index.tsx first
    const container = getByTestId('index-container');
    
    expect(container.props.style).toEqual({
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    });
  });
}); 