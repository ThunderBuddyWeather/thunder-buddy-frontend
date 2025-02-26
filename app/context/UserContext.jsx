import React, { createContext, useContext, useState } from 'react';

// Create a context for user data
export const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
