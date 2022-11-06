import React, { useState, useEffect } from 'react';
import { LoginScreen } from 'musicmap/pages/LoginScreen'; 
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInScreen } from 'musicmap/pages/LoggedInScreen'; 
import { createStackNavigator } from '@react-navigation/stack';
import { save, getValueFor } from "musicmap/SecureStore"; 

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(""); 

  useEffect(() => {
    async function checkTokensAndSetNavigation() {
      try {
        // setItemAsync still needs to be implemented in the app
        const token = await getValueFor("ACCESS_TOKEN");
        console.log("token: " + token); 

        if (token !== null) {
          console.log('inside token != null'); 
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

  console.log("initialRoute: " + initialRoute)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"login"}>
        <Stack.Screen options={{ headerShown: false }} name="login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="loggedin" component={LoggedInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 