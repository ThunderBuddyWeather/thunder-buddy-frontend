import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';

export default function ContactList({ contacts }) {
  const ContactCard = ({ contact }) => {
    const { name, weatherIcon, alert, picture } = contact;
    const weatherIconUrl = `https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`;

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
          <Image
            source={{ uri: weatherIconUrl }}
            resizeMode="contain"
            style={styles.weatherImage}
          />
          {alert && (
            <Avatar.Icon
              size={32}
              icon="alert-circle"
              color="white"
              style={styles.alertIcon}
            />
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <ScrollView style={styles.scrollContainer}>
        {contacts.map((contact) => (
          <ContactCard key={contact.userId} contact={contact} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  alertIcon: {
    backgroundColor: 'red',
    marginLeft: 16,
  },
  card: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
  },
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    marginLeft: 16,
  },
  profileIcon: {
    // No additional styling needed; Paper's Avatar.Icon is circular by default.
  },
  profileImage: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  weatherImage: {
    height: 48,
    marginLeft: 16,
    width: 48,
  },
});
