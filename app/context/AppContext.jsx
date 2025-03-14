import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [alert, setAlert] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [myContacts, setMyContacts] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        weather,
        setWeather,
        alert,
        setAlert,
        contacts,
        setContacts,
        myContacts,
        setMyContacts,
        initialLoadComplete,
        setInitialLoadComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
