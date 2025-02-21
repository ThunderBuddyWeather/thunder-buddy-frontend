import React from 'react';
import { render } from '@testing-library/react-native';
import { UserProvider } from '../../app/context/UserContext';

export const renderWithProvider = (component, { username = null } = {}) => {
  return render(
    <UserProvider initialUsername={username}>
      {component}
    </UserProvider>
  );
}; 