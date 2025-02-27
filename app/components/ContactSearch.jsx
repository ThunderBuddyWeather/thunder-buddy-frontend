import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';

export default function ContactSearch({ contacts, myContacts, onSendFriendRequest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestStatus, setRequestStatus] = useState({});

  const handleFriendRequest = async (userId) => {
    setRequestStatus((prev) => ({ ...prev, [userId]: 'pending' }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRequestStatus((prev) => ({ ...prev, [userId]: 'success' }));
      if (onSendFriendRequest) {
        onSendFriendRequest(userId);
      }
    } catch (error) {
      setRequestStatus((prev) => ({ ...prev, [userId]: 'error' }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRequestStatus((prev) => ({ ...prev, [userId]: 'idle' }));
    }
  };

  const filteredContacts = searchQuery.trim()
    ? contacts.filter((contact) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          contact.username.toLowerCase().includes(lowerQuery) &&
          !myContacts.some((c) => c.userId === contact.userId)
        );
      })
    : [];

  const renderContact = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {item.picture ? (
          <View>
            <Avatar.Image size={48} source={{ uri: item.picture }} />
          </View>
        ) : (
          <Avatar.Icon size={48} icon="account" />
        )}
        <Text style={styles.contactName}>{item.username}</Text>
        <TouchableOpacity
          style={[
            styles.friendButton,
            (requestStatus[item.userId] === 'pending' ||
              requestStatus[item.userId] === 'success') && styles.friendButtonDisabled,
          ]}
          onPress={() => handleFriendRequest(item.userId)}
          disabled={
            requestStatus[item.userId] === 'pending' ||
            requestStatus[item.userId] === 'success'
          }
        >
          <Text style={styles.friendButtonText}>
            {requestStatus[item.userId] === 'success' ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter username..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.trim().length > 0 ? (
        filteredContacts.length > 0 ? (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.userId}
            renderItem={renderContact}
          />
        ) : (
          <Text style={styles.noResults}>No contacts found</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1,
    margin: 8,
    padding: 8,
  },
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  contactName: {
    fontSize: 16,
  },
  friendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  friendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  friendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noResults: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  searchInput: {
    borderColor: '#D1D5DB',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
