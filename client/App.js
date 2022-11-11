import React, { useState, useEffect } from 'react';
import LoginScreen from 'musicmap/pages/LoginScreen'; 
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInScreen } from 'musicmap/pages/LoggedInScreen'; 
import { createStackNavigator } from '@react-navigation/stack';
import { save, getValueFor } from "musicmap/util/SecureStore"; 
import { REACT_APP_BASE_URL } from "@env"; 
import axios from "axios"; 
//import { createAppContainer } from 'react-navigation';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests"; 

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(""); 
  const [authCode, setAuthCode] = useState("");

  // get user's username from Spotify API

  // async function getUserInfo() {
  //   const accessToken = await getAccessTokenFromSecureStorage();

  //   const response = await fetch("https://api.spotify.com/v1/me", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  //   if (response) {
  //     const responseJson = await response.json();
  //     console.log("poop: " + responseJson); 
  //     return [responseJson.display_name, responseJson.id, responseJson.followers.total, responseJson.images[0].url];  
  //   } else {
  //     console.log("getUserInfo request returned no response");
  //   }
  // }

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
        children = {props => <LoginScreen navigation = {props.navigation} authCode = {authCode} setAuthCode = {setAuthCode}/>}
        //component={LoginScreen} 
        />
        <Stack.Screen options={{ headerShown: false }} name="loggedin" 
        //component = {LoggedInScreen}
        children = {props => <LoggedInScreen navigation = {props.navigation} loginToParent = {loginToParent}/>}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}