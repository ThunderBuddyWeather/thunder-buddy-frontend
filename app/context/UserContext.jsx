import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children, initialUsername = null }) {
  const [username, setUsername] = useState(initialUsername);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
