import OneSignal from "react-native-onesignal";
import { ONE_SIGNAL_APP_ID} from "@env";



export const initializeOneSignal = () => {
  OneSignal.setAppId(ONE_SIGNAL_APP_ID)

  // Retrieve Player ID and send to backend
  OneSignal.getDeviceState().then((device) => {
    if (device && device.userId) {
      console.log("OneSignal Player ID:", device.userId);
      saveOneSignalPlayerId(device.userId); 
    }
  });

  // Handle foreground notifications
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    console.log("Notification Received:", notificationReceivedEvent);
  });

  // Handle notification click event
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("Notification Opened:", notification);
  });
};






