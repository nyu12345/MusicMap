import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, startAsync } from "expo-auth-session";
import { Button, SafeAreaView } from "react-native";
import { Buffer } from "buffer";
import queryString from 'query-string'
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

// NOTE (WARNING):
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this!
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes
// API calls for your client and passes the data back.

export function LoginScreen() {
  const [authCode, setAuthCode] = useState("");

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
      usePKCE: false,
      redirectUri: makeRedirectUri({
        useProxy: false,
      }), 
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    }
  );

  // get Spotify API access token using authorization code
  async function getToken() {
    
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

    const responseJson = await response.json(); 
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    console.log(accessToken); 
    console.log(refreshToken); 
    console.log(expiresIn); 
    console.log(expirationTime); 
  }

  useEffect(() => {
    if (response?.type === "success") {
      setAuthCode(response.params.code);
      getToken(); 
    } 
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
