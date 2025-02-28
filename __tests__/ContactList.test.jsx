/* global describe, it, expect, jest */
import React from 'react';
import { render } from '@testing-library/react-native';
import ContactList from '../app/components/ContactList';
import { Image } from 'react-native';

// Mock react-native-paper components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const Card = ({ children, style }) => React.createElement('div', { style }, children);
  Card.displayName = 'Card';
  Card.Content = ({ children, style }) => React.createElement('div', { style }, children);
  Card.Content.displayName = 'Card.Content';
  
  return {
    Card,
    Avatar: {
      Icon: ({ size, icon, style }) => {
        const AvatarIcon = ({ icon, style }) => React.createElement('div', { style }, icon);
        AvatarIcon.displayName = 'Avatar.Icon';
        return AvatarIcon({ size, icon, style });
      }
    }
  };
});

describe('ContactList', () => {
  const mockContacts = [
    {
      userId: '1',
      name: 'John Doe',
      weatherIcon: 'c01d',
      alert: null,
      picture: null
    },
    {
      userId: '2',
      name: 'Jane Smith',
      weatherIcon: 'r01d',
      alert: 'Flood Warning',
      picture: 'https://example.com/picture.jpg'
    }
  ];

  it('renders the contacts title', () => {
    const { getByText } = render(<ContactList contacts={[]} />);
    expect(getByText('Contacts')).toBeTruthy();
  });

  it('renders an empty list when no contacts are provided', () => {
    const { queryByText } = render(<ContactList contacts={[]} />);
    expect(queryByText('John Doe')).toBeNull();
  });

  it('renders contact cards with names', () => {
    const { getByText } = render(<ContactList contacts={mockContacts} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('renders weather icons for contacts', () => {
    const { UNSAFE_getAllByType } = render(<ContactList contacts={mockContacts} />);
    const images = UNSAFE_getAllByType(Image);
    
    // Each contact should have a weather icon
    expect(images.some(img => 
      img.props.source.uri === 'https://www.weatherbit.io/static/img/icons/c01d.png'
    )).toBeTruthy();
    expect(images.some(img => 
      img.props.source.uri === 'https://www.weatherbit.io/static/img/icons/r01d.png'
    )).toBeTruthy();
  });

  it('renders profile pictures when available', () => {
    const { UNSAFE_getAllByType } = render(<ContactList contacts={mockContacts} />);
    const images = UNSAFE_getAllByType(Image);
    
    // Jane Smith should have a profile picture
    expect(images.some(img => 
      img.props.source.uri === 'https://example.com/picture.jpg'
    )).toBeTruthy();
  });

  it('renders avatar icon when no profile picture is available', () => {
    const { UNSAFE_getAllByType } = render(<ContactList contacts={mockContacts} />);
    const avatars = UNSAFE_getAllByType('div').filter(
      element => element.props.children === 'account'
    );
    
    // John Doe should have an avatar icon
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('renders alert icons for contacts with alerts', () => {
    const { UNSAFE_getAllByType } = render(<ContactList contacts={mockContacts} />);
    const alertIcons = UNSAFE_getAllByType('div').filter(
      element => element.props.children === 'alert-circle'
    );
    
    // Only Jane Smith has an alert
    expect(alertIcons.length).toBe(1);
  });
}); 