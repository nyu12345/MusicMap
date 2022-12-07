import React, { useState, useEffect, useRef } from 'react';
import LoginScreen from 'musicmap/pages/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInScreen } from 'musicmap/pages/LoggedInScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { save, getValueFor } from "musicmap/util/SecureStore";
import * as Notifications from 'expo-notifications';
//import { createAppContainer } from 'react-navigation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import * as Device from 'expo-device';

const registerForPushNotificationsAsync = async () => {
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
      console.log(token);
      await save("NOTIFICATION_TOKEN", token);
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

  return token;
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
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

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("");
  const [authCode, setAuthCode] = useState("");

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect( () => {
    // Register for push notification
    const token = registerForPushNotificationsAsync();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      notificationCommonHandler(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification 
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      notificationCommonHandler(response.notification);
      notificationNavigationHandler(response.notification.request.content);
    });

    // The listeners must be clear on app unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const notificationCommonHandler = (notification) => {
    // save the notification to reac-redux store
    console.log('A notification has been received', notification)
  }


  const notificationNavigationHandler = ({ data }) => {
    // navigate to app screen
    console.log('A notification has been touched', data)
  }

  const loginToParent = () => {
    console.log("TESTU TESTSTT");
    setAuthCode("");
  }

  useEffect(() => {
    async function checkTokensAndSetNavigation() {
      try {
        // setItemAsync still needs to be implemented in the app
        const token = await getValueFor("ACCESS_TOKEN");
        console.log("in App level");
        console.log(token);

        if (token !== undefined) {
          console.log('non-null token, set route to loggedin');
          setInitialRoute("loggedin");
        } else {
          console.log('null token, set route to login');
          setInitialRoute("login");
        }
      } catch (error) {
        setInitialRoute("login");
      }

      // if (initialRoute === "loggedin") {
      //   props.navigation.navigate("loggedin"); 
      // }
    }
    checkTokensAndSetNavigation();
  });

  console.log("initialRoute: " + initialRoute)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"login"}>
        <Stack.Screen options={{ headerShown: false }} name="login"
          children={props => <LoginScreen navigation={props.navigation} authCode={authCode} setAuthCode={setAuthCode} />}
        //component={LoginScreen} 
        />
        <Stack.Screen options={{ headerShown: false }} name="loggedin"
          //component = {LoggedInScreen}
          children={props => <LoggedInScreen navigation={props.navigation} loginToParent={loginToParent} />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}