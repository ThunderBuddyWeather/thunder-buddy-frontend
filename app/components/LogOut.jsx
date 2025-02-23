import React from 'react';
import { Button } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { authDomain, clientId } from '../../auth0-config';

export default function LogoutButton() {
  const { setUser } = useUser();

  const handleLogout = () => {
    setUser(null);

    const returnTo = encodeURIComponent('http://localhost:8081'); 
    const logoutUrl = `https://${authDomain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
    window.location.href = logoutUrl;
  };

  return (
    <Button mode="contained" onPress={handleLogout}>
      Log Out
    </Button>
  );
}
