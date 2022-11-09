import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, startAsync } from "expo-auth-session";
import { Button, SafeAreaView } from "react-native";
import { Buffer } from "buffer";
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";
import axios from "axios";
import { save, getValueFor, isAvailable } from "musicmap/SecureStore"; 

WebBrowser.maybeCompleteAuthSession();

// NOTE (WARNING):
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this!
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes
// API calls for your client and passes the data back.

const LoginScreen = props => {
  const [authCode, setAuthCode] = useState("");
  //const navigation = useNavigation();

  // need to move this somewhere else
  // async function setToken(value) {
  //   await SecureStore.setItemAsync("AUTH_TOKEN", value);
  // }

  const checkLoginState = async() => {
    const accessToken = await getValueFor("ACCESS_TOKEN"); 
    props.navigation.navigate(accessToken ? "loggedin" : "login"); 
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-follow-read",
        "user-read-currently-playing",
        "user-top-read",
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        useProxy: false,
      }),  
      //show_dialog: true, 
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    }
  );

  // get Spotify API access token using authorization code
  async function getAccessToken() {
    //const authCode = await getValueFor("AUTH_CODE"); 
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${
        makeRedirectUri({
          useProxy: false,
        })
      }`,
    });

    //if (response) {
    const responseJson = await response.json(); 
    console.log("access token fetch response: "); 
    console.log(responseJson); 
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = await responseJson;

    const expirationTime = await (new Date().getTime() + expiresIn * 1000).toString();

    await save("ACCESS_TOKEN", accessToken); 
    await save("REFRESH_TOKEN", refreshToken); 
    await save("EXPIRATION_TIME", expirationTime); 

    const secureStoreToken = getValueFor("ACCESS_TOKEN");
    props.navigation.navigate(accessToken ? "loggedin" : "login"); 
    // } else {
    //   console.log("access token response failed"); 
    // }
  } 

  // async function getRefreshTokens() {
  //   try {
  //     const credentials = await getSpotifyCredentials() //we wrote this function above
  //     const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
  //     const refreshToken = await getUserData('refreshToken');
  //     const response = await fetch('https://accounts.spotify.com/api/token', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Basic ${credsB64}`,
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  //     });
  //     const responseJson = await response.json();
  //     if (responseJson.error) {
  //       await getTokens();
  //     } else {
  //       const {
  //         access_token: newAccessToken,
  //         refresh_token: newRefreshToken,
  //         expires_in: expiresIn,
  //       } = responseJson;
  
  //       const expirationTime = new Date().getTime() + expiresIn * 1000;
  //       await setUserData('accessToken', newAccessToken);
  //       if (newRefreshToken) {
  //         await setUserData('refreshToken', newRefreshToken);
  //       }
  //       await setUserData('expirationTime', expirationTime);
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  useEffect(() => {
    if (response?.type === "success") {
      console.log("setting auth code"); 
      console.log(response); 
      save("AUTH_CODE", response.params.data); // save auth code to Secure Store
      setAuthCode(response.params.code);
    }
    if (authCode !== null) {
      getAccessToken(); 
      //setAuthCode(null); 
    }
    // if (getValueFor("ACCESS_TOKEN") !== null) {
    //   checkLoginState();
    // }
  });

  return (
    <SafeAreaView>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync({ useProxy: false });
        }}
      />
    </SafeAreaView>
  );
}

LoginScreen.navigationOptions = {
  title: "Log In"
}; 

export default LoginScreen; 