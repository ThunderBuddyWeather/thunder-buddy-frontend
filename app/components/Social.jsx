import React, { useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import ContactList from './ContactList';
import ContactSearch from './ContactSearch';
import { useAppContext } from '../context/AppContext';
import LogOut from './LogOut';

export default function Social() {
  const { user } = useAppContext();

  useEffect(() => {
    if (!user) {
      console.log('User not logged in.');
      // Navigation to LogIn would be handled via your navigation solution.
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={socialStyles.container}>
        <Text style={socialStyles.title}>
          {user ? `Welcome, ${user.name}!` : 'Please log in!'}
        </Text>
        {user && <ContactSearch />}
        {user && <ContactList />}
      </ScrollView>
      {user ? <LogOut /> : null}
    </SafeAreaView>
  );
}

const socialStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
