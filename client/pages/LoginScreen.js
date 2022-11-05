import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button, SafeAreaView } from "react-native";
import { Buffer } from 'buffer';
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";
import axios from "axios";
import * as Crypto from 'expo-crypto';

WebBrowser.maybeCompleteAuthSession();

// NOTE (WARNING):
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this!
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes
// API calls for your client and passes the data back.

export function LoginScreen() {
  const [authCode, setAuthCode] = useState("");
  //const [hashedCodeVerifier, setHashedCodeVerifier] = useState(""); 
  //const [userInfo, setUserInfo] = useState();

  // need to move this somewhere else
  // async function setToken(value) {
  //   await SecureStore.setItemAsync("AUTH_TOKEN", value);
  // }

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
      redirectUri: makeRedirectUri({
        useProxy: false,
      }),
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    }
  );

  useEffect(() => {
    //generateCodeVerifier(); 
    if (response?.type === "success") {
      setAuthCode(response.params.code);
      console.log("success");
      console.log("below is auth code: ");
      console.log(response.params);
      // getToken(authCode); 
      // console.log("token response: "); 
      // console.log()
    }
  }, [response]);

  // get Spotify API access token using authorization code
  // async function getToken(authCode) {
  //   console.log(authCode);
  //   const response = await axios.post(
  //     "https://accounts.spotify.com/api/token", 
  //     {
  //       grant_type: "authorization_code", 
  //       code: authCode, 
  //       redirect_uri: makeRedirectUri({
  //         useProxy: false,
  //       }), 
  //     }, 
  //     headers: {
  //       'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
  //     },
  //     json: true
  //   ); 
  // }

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
