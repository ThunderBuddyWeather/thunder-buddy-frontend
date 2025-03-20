import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { Card, Modal, Portal, Button, Avatar, Divider } from 'react-native-paper';
import { useAppContext } from '../context/AppContext.jsx';

const API_KEY = 'bc03c97ff0b740569b8d21b93f241fa6';

export default function Alerts() {
  const [visible, setVisible] = useState(false);
  const { weather, alert, setAlert } = useAppContext();

  const dummyAlert = {
    alerts: [
      {
        description:
          "* WHAT...Flooding caused by excessive rainfall is expected.\n\n* WHERE...A portion of east central Florida, including the following counties: Lake, Orange and Seminole.\n\n* WHEN...Until 615 PM EDT.\n\n* IMPACTS...Minor flooding in low-lying and poor drainage areas.\n\n* ADDITIONAL DETAILS...\n- At 419 PM EDT, Doppler radar indicated heavy rain due to thunderstorms. Minor flooding is ongoing or expected to begin shortly in the advisory area. Between 1.5 and 3 inches of rain have fallen.\n- Additional rainfall amounts of 1 to 2 inches are expected over the area. This additional rain will result in minor flooding.\n- Some locations that will experience flooding include Orlando, Sanford, Apopka, Altamonte Springs, Winter Springs, Casselberry, Maitland, Lake Mary, Longwood, Lockhart, Mount Plymouth, Cassia, Zellwood, Pine Hills, Wekiwa Springs State Park, Wekiva Springs, Forest City, Fern Park, Sorrento and Fairview Shores.\n- http://www.weather.gov/safety/flood",
        effective_local: "2024-08-22T16:19:00",
        effective_utc: "2024-08-22T20:19:00",
        ends_local: "2024-08-22T18:15:00",
        ends_utc: "2024-08-22T22:15:00",
        expires_local: "2024-08-22T18:15:00",
        expires_utc: "2024-08-22T22:15:00",
        onset_local: "2024-08-22T16:19:00",
        onset_utc: "2024-08-22T20:19:00",
        regions: ["Lake, FL", " Orange, FL", " Seminole, FL"],
        severity: "Advisory",
        title: "Flood Advisory issued August 22 at 4:19PM EDT until August 22 at 6:15PM EDT by NWS Melbourne FL",
        uri:
          "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.9079ecdac4135d19817f4fd0647a7493256e5c34.001.1",
        affectedContacts: [
          { name: "Aasim", picture: "https://cdn-icons-png.freepik.com/512/5997/5997002.png" },
          { name: "Bobby", picture: null },
          { name: "Reid", picture: "https://cdn-icons-png.freepik.com/512/5997/5997002.png" },
        ],
      },
    ],
    city_name: "Orlando",
    country_code: "US",
    lat: 28.5384,
    lon: -81.3789,
    state_code: "FL",
    timezone: "America/New_York",
  };
  
  useEffect(() => {
    const fetchAlerts = async () => {
      console.log('fetching alerts')
      if (!weather || !weather.lat || !weather.lon) {
        console.log("Weather context not available or missing lat/lon");
        return;
      }
      const url = `https://api.weatherbit.io/v2.0/alerts?lat=${weather.lat}&lon=${weather.lon}&key=${API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setAlert((prevAlert) => {
            if (data.alerts && data.alerts.length > 0) {
              return data.alerts[0];
            } else {
              console.log("No alerts from API, current alert state:", prevAlert);
              return null;
            }
          });
        } else {
          console.log("Failed to fetch alerts:", data);
        }
      } catch (err) {
        console.log("Error fetching alerts:", err);
      }
    };
    fetchAlerts();
  }, [weather]);

  const openLink = (uri) => {
    if (uri) {
      Linking.openURL(uri);
    }
  };

  const loadDummyAlert = () => {
    setAlert(dummyAlert.alerts[0]);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableOpacity onPress={loadDummyAlert} style={styles.loadButton}>
        <Text style={styles.loadButtonText}>Use Dummy Alert</Text>
      </TouchableOpacity>
      <View style={styles.cardWrapper}>
        {alert ? (
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Card style={styles.card}>
              <Card.Title
                title={alert.title}
                subtitle={`Severity: ${alert.severity}`}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="alert-circle"
                    color="white"
                    style={styles.cardIcon}
                  />
                )}
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardSubtitle}
              />
            </Card>
            {alert.affectedContacts && (
              <View style={styles.affectedContactsContainer}>
                {alert.affectedContacts.map((contact, index) =>
                  contact.picture ? (
                    <Image
                      key={index}
                      source={{ uri: contact.picture }}
                      style={styles.affectedContactImage}
                      
                    />
                  ) : (
                    <Avatar.Icon
                      key={index}
                      size={48} 
                      icon="account"
                      style={styles.affectedContactIcon}
                    />
                  )
                )}
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.noAlertText}>No active alerts.</Text>
            </Card.Content>
          </Card>
        )}
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{alert?.title}</Text>
          <Divider style={styles.modalDivider} />
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Severity:</Text> {alert?.severity}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Effective:</Text>{" "}
            {alert ? new Date(alert.effective_local).toLocaleString() : ""}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Expires:</Text>{" "}
            {alert ? new Date(alert.expires_local).toLocaleString() : ""}
          </Text>
          <Text style={styles.modalText}>
            <Text style={styles.modalLabel}>Affected Regions:</Text>{" "}
            {alert ? alert.regions.join(", ") : ""}
          </Text>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalDescription}>{alert?.description}</Text>
          </ScrollView>
          <View style={styles.modalButtonRow}>
            <Button mode="contained" onPress={() => setVisible(false)}>
              <Text>Close</Text>
            </Button>
            {alert?.uri && (
              <Button
                mode="contained"
                onPress={() => openLink(alert.uri)}
                style={styles.modalLinkButton}
                labelStyle={styles.modalLinkButtonLabel}
              >
                <Text>View Official Alert</Text>
              </Button>
            )}
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  affectedContactIcon: {
    borderRadius: 12,
    marginLeft: 4,
  },
  affectedContactImage: {
    borderRadius: 12,
    height: 48, // Increased size (2x)
    marginLeft: 4,
    width: 48,  // Increased size (2x)
  },
  affectedContactsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16, // Moved further left inside the card
    bottom: 16, // Moved further up inside the card
  },
  card: {
    backgroundColor: '#fee',
    borderColor: '#f00',
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
    padding: 8,
  },
  cardIcon: {
    backgroundColor: '#B22222',
  },
  cardSubtitle: {
    color: '#B22222',
    fontSize: 14,
  },
  cardTitle: {
    color: '#B22222',
    fontSize: 16,
  },
  cardWrapper: {
    position: 'relative',
    width: '100%',
  },
  loadButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  loadButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    padding: 20,
  },
  modalDescription: {
    color: '#555',
    fontSize: 16,
    marginBottom: 4,
  },
  modalDivider: {
    marginBottom: 8,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  modalLinkButton: {
    backgroundColor: '#B22222',
  },
  modalLinkButtonLabel: {
    color: 'white',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalTitle: {
    color: '#B22222',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noAlertText: {
    color: 'green',
    fontSize: 18,
  },
  wrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    width: '95%',
  },
});
