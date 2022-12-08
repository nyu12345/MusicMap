import React, { useState, useEffect, useRef } from 'react';
import LoginScreen from 'musicmap/pages/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInScreen } from 'musicmap/pages/LoggedInScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { getValueFor } from "musicmap/util/SecureStore";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerForPushNotificationsAsync, notificationCommonHandler, notificationNavigationHandler } from "musicmap/util/Notifications";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("");
  const [authCode, setAuthCode] = useState("");

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect( () => {
    // Register for push notification
    registerForPushNotificationsAsync();

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