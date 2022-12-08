import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { save } from "musicmap/util/SecureStore";

/**
 * generates a notification token for the current user
 * @returns void
 */
export async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      let token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("NOTIFICATION TOKEN: " + token);
      save("NOTIF_TOKEN", token); // save notification token to Secure Store
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
}

/**
 * sends a notification to the target user based on the input token
 * @param {the user's expo notification token} expoPushToken 
 * @param {the title of the notification} title 
 * @param {the body of the notification} body 
 */
export async function sendPushNotification(expoPushToken, title, body) {
    console.log("SENDING NOTIFICATION");
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export function notificationCommonHandler(notification) {
    // save the notification to reac-redux store
    console.log('A notification has been received', notification);
}


export function notificationNavigationHandler({ data }) {
    // navigate to app screen
    console.log('A notification has been touched', data)
}