import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [weather, setWeather] = useState(null);

  const [alert, setAlert] = useState(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        weather,
        setWeather,
        alert,
        setAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
