import React, { useState } from 'react';
import { View, Text, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Modal, Portal, Button, Avatar, Divider } from 'react-native-paper';
import { useAppContext } from '../context/AppContext.jsx';
import { pushUser } from '../queries.js';

export default function AlertCard() {
  const [visible, setVisible] = useState(false);
  const { alert, setAlert } = useAppContext();  
  const { weatherCoords, authToken, user, BASE_URL, expoPushToken } = useAppContext();

  const dummyAlert = {
    alerts: [
      {
        description: "* WHAT...Flooding caused by excessive rainfall is expected.\n\n* WHERE...A portion of east central Florida, including the following counties: Lake, Orange and Seminole.\n\n* WHEN...Until 615 PM EDT.\n\n* IMPACTS...Minor flooding in low-lying and poor drainage areas.\n\n* ADDITIONAL DETAILS: \n- At 419 PM EDT, Doppler radar indicated heavy rain due to thunderstorms. Minor flooding is ongoing or expected to begin shortly in the advisory area. Between 1.5 and 3 inches of rain have fallen.\n- Additional rainfall amounts of 1 to 2 inches are expected over the area. This additional rain will result in minor flooding.\n- Some locations that will experience flooding include Orlando, Sanford, Apopka, Altamonte Springs, Winter Springs, Casselberry, Maitland, Lake Mary, Longwood, Lockhart, Mount Plymouth, Cassia, Zellwood, Pine Hills, Wekiwa Springs State Park, Wekiva Springs, Forest City, Fern Park, Sorrento and Fairview Shores.\n- http://www.weather.gov/safety/flood",
        effective_local: "2024-08-22T16:19:00",
        effective_utc: "2024-08-22T20:19:00",
        ends_local: "2024-08-22T18:15:00",
        ends_utc: "2024-08-22T22:15:00",
        expires_local: "2024-08-22T18:15:00",
        expires_utc: "2024-08-22T22:15:00",
        onset_local: "2024-08-22T16:19:00",
        onset_utc: "2024-08-22T20:19:00",
        regions: [
          "Lake, FL",
          "Orange, FL",
          "Seminole, FL"
        ],
        severity: "Advisory",
        title: "Flood Advisory issued August 22 at 4:19PM EDT until August 22 at 6:15PM EDT by NWS Melbourne FL",
        uri: "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.9079ecdac4135d19817f4fd0647a7493256e5c34.001.1"
      }
    ],
    city_name: "Orlando",
    country_code: "US",
    lat: 28.5384,
    lon: -81.3789,
    state_code: "FL",
    timezone: "America/New_York"
  };

  // useEffect(() => {
  //   setAlert(dummyAlert.alerts[0]);
  // }, [setAlert]);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const openLink = (uri) => {
    if (uri) {
      Linking.openURL(uri);
    }
  };

  return (
    <View style={{ margin: 16, width: '100%' }}>
      {alert ? (
        <TouchableOpacity onPress={openModal}>
          <Card style={{ backgroundColor: '#fee', borderColor: '#f00', borderWidth: 1, width: '100%' }}>
            <Card.Title
              title={alert.title}
              subtitle={`Severity: ${alert.severity}`}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="alert-circle"
                  color="white"
                  style={{ backgroundColor: '#B22222' }}
                />
              )}
              titleStyle={{ color: '#B22222', fontSize: 16 }}
              subtitleStyle={{ color: '#B22222', fontSize: 14 }}
            />
          </Card>
        </TouchableOpacity>
      ) : (
        <Text>No alerts available</Text>
      )}

      <Button
        mode="contained"
        onPress={() => {
          setAlert(dummyAlert.alerts[0])
          const payload = {
            user_id: user.sub,
            user_username: user.nickname || user.name,
            user_name: user.name,
            user_email: user.email,
            user_phone: user.phone || "",
            user_address: user.address || "",
            user_location: weatherCoords ? `${weatherCoords.latitude} ${weatherCoords.longitude}` : "",
            user_severe_weather_alert: JSON.stringify(alert),
            expo_push_token: expoPushToken,
          };
          pushUser({ payload, BASE_URL, authToken })
            .then((data) => {
              console.log("User pushed successfully:", data);
            })
            .catch((err) => {
              console.error("Error pushing user:", err);
            });
        }}
        style={{ marginTop: 10 }}
      >
        <Text>Use Dummy Alert</Text>
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#B22222', marginBottom: 8 }}>
            {alert?.title}
          </Text>
          <Divider style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Severity:</Text> {alert?.severity}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Effective:</Text> {alert ? new Date(alert.effective_local).toLocaleString() : ''}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Expires:</Text> {alert ? new Date(alert.expires_local).toLocaleString() : ''}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Affected Regions:</Text> {alert?.regions ? alert.regions.join(', ') : ''}
          </Text>
          <ScrollView style={{ backgroundColor: '#eee', padding: 8, borderRadius: 4, marginTop: 8, maxHeight: 160 }}>
            <Text style={{ color: '#555' }}>{alert?.description}</Text>
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button mode="contained" onPress={closeModal}>
              <Text>Close</Text>
            </Button>
            {alert?.uri && (
              <Button
                mode="contained"
                onPress={() => openLink(alert.uri)}
                style={{ backgroundColor: '#B22222' }}
                labelStyle={{ color: 'white' }}
              >
                <Text>View Official Alert</Text>
              </Button>
            )}
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
