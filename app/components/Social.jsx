import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ContactList from './ContactList.jsx';
import ContactSearch from './ContactSearch.jsx';

export default function Social() {
  const [fullContacts, setFullContacts] = useState([]);
  const [myContacts, setMyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullContacts = async () => {
      try {
        // Simulated network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = [
          {
            name: 'Aasim',
            userId: 'test1',
            weather: 'Sunny',
            weatherIcon: 'c01d',
            alert: null,
            picture: null,
            username: 'Aasim',
          },
          {
            name: 'Bobby',
            userId: 'test2',
            weather: 'Cloudy',
            weatherIcon: 'c03d',
            alert: null,
            picture: null,
            username: 'Bobby',
          },
          {
            name: 'Reid',
            userId: 'test3',
            weather: 'Rain',
            weatherIcon: 'r01d',
            alert: 'Flood Warning',
            picture: null,
            username: 'Reid',
          },
          {
            name: 'Sam',
            userId: 'test4',
            weather: 'Windy',
            weatherIcon: 'c04d',
            alert: null,
            picture: null,
            username: 'Sam',
          },
        ];
        setFullContacts(data);
      } catch (error) {
        console.error('Error fetching full contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullContacts();
  }, []);

  const handleSendFriendRequest = (userId) => {
    const contactToAdd = fullContacts.find((c) => c.userId === userId);
    if (contactToAdd && !myContacts.some((c) => c.userId === userId)) {
      setMyContacts((prev) => [...prev, contactToAdd]);
    }
  };

  if (loading) {
    return (
      <View style={socialStyles.loadingContainer}>
        <Text style={socialStyles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={socialStyles.container}>
      <Text style={socialStyles.title}>Social Hub</Text>
      <ContactSearch
        contacts={fullContacts}
        myContacts={myContacts}
        onSendFriendRequest={handleSendFriendRequest}
      />
      <ContactList contacts={myContacts} />
    </View>
  );
}

const socialStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
