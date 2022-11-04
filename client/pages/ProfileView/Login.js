import React, { useState, useEffect } from "react";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

// NOTE (WARNING): 
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this! 
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes 
// API calls for your client and passes the data back.

export function LoginScreen() {
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID, 
      clientSecret: CLIENT_SECRET, 
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
      })
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync({ useProxy: false });
      }}
    />
  );
}