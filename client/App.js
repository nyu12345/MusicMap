import React, { useState, useEffect } from 'react';
import { LoginScreen } from 'musicmap/pages/LoginScreen'; 
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInScreen } from 'musicmap/pages/LoggedInScreen'; 
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(""); 

  useEffect(() => {
    async function checkTokensAndSetNavigation() {
      try {
        // setItemAsync still needs to be implemented in the app
        const token = await SecureStore.getItemAsync(TOKEN_KEY);

        if (token !== null) {
          setInitialRoute("loggedin");
        } else {
          setInitialRoute("login");
        }
      } catch (error) {
        setInitialRoute("login");
      }
    }
    checkTokensAndSetNavigation();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"login"}>
        <Stack.Screen options={{ headerShown: false }} name="login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="loggedin" component={LoggedInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 