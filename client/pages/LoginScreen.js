import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, startAsync } from "expo-auth-session";
import { Button, SafeAreaView } from "react-native";
import { Buffer } from "buffer";
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";
import axios from "axios";
import { save, getValueFor, isAvailable } from "musicmap/util/SecureStore"; 
import { getAccessToken, getRefreshTokens } from "musicmap/util/TokenRequests"; 

WebBrowser.maybeCompleteAuthSession();

// NOTE (WARNING):
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this!
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes
// API calls for your client and passes the data back.

const LoginScreen = props => {
  const [authCode, setAuthCode] = useState("");

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

  useEffect(() => {
    if (response?.type === "success") {
      console.log("setting auth code"); 
      console.log(response); 
      //save("AUTH_CODE", response.params.data); // save auth code to Secure Store
      setAuthCode(response.params.code);
    }
    if (authCode !== null) {
      getAccessToken(authCode, props); 
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

LoginScreen.navigationOptions = {
  title: "Log In"
}; 

export default LoginScreen; 