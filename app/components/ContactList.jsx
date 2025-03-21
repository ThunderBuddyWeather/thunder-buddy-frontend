import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { useFriends } from '../queries';
import { useAppContext } from '../context/AppContext';

export default function ContactList() {
  const { user, BASE_URL } = useAppContext();
  const currentUsername = user ? user.nickname || user.name : null;
  const {
    data: friends,
    isLoading,
    error,
  } = useFriends(currentUsername, BASE_URL);

  if (isLoading) return <Text>Loading contacts...</Text>;
  if (error) return <Text>Error loading contacts: {error.message}</Text>;

  const ContactCard = ({ contact }) => {
    const { name, picture } = contact;
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {picture ? (
            <Image
              source={{ uri: picture }}
              resizeMode="cover"
              style={styles.profileImage}
            />
          ) : (
            <Avatar.Icon size={48} icon="account" style={styles.profileIcon} />
          )}
          <Text style={styles.nameText}>{name}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <ScrollView style={styles.scrollContainer}>
        {friends.map(contact => (
          <ContactCard key={contact.user_id} contact={contact} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    maxWidth: 400,
    alignSelf: 'center',
  },
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  nameText: {
    fontSize: 16,
    marginLeft: 16,
  },
  profileIcon: {},
  profileImage: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
