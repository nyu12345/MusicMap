import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, startAsync } from "expo-auth-session";
import { Button, SafeAreaView, StyleSheet, View, Pressable, Text, Image } from "react-native";
import { Buffer } from "buffer";
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";
import axios from "axios";
import { save, getValueFor, isAvailable } from "musicmap/util/SecureStore";
import { getAccessToken, getRefreshTokens } from "musicmap/util/TokenRequests";
import Icon from "react-native-vector-icons/FontAwesome";

WebBrowser.maybeCompleteAuthSession();

// NOTE (WARNING):
// read "Security Considerations" in https://docs.expo.dev/versions/latest/sdk/auth-session/#it-makes-redirect-url-allowlists-easier-to
// Never put any secret keys inside of your app, there is no secure way to do this!
// Instead, you should store your secret key(s) on a server and expose an endpoint that makes
// API calls for your client and passes the data back.

const LoginScreen = (props) => {
  //const [authCode, setAuthCode] = useState("");

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

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     console.log("setting auth code");
  //     console.log(response);
  //     //save("AUTH_CODE", response.params.data); // save auth code to Secure Store
  //     props.setAuthCode(response.params.code);
  //   }
  //   if (props.authCode !== null) {
  //     console.log("access token got");
  //     getAccessToken(props.authCode, props);
  //   }
  // });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("setting auth code");
      console.log(response);
      //save("AUTH_CODE", response.params.data); // save auth code to Secure Store
      props.setAuthCode(response.params.code);
    }
    if (props.authCode !== null) {
      console.log("access token got");
      getAccessToken(props.authCode, props);
    }
  });

  return (
    <SafeAreaView style={styles.root}>
      <Image
        style={styles.logo}
        source={require("musicmap/assets/logo.png")}
      />
      <Text style={styles.musicMapText}>
        MusicMap
      </Text>
      <Text style={styles.appDescriptionText}>
        Roadtrip music and memories! 
      </Text>
      <Pressable style={styles.loginButton} onPress={()=>{
        promptAsync({useProxy: false}); 
      }}>
        <Text style={styles.loginButtonText}>LOG IN WITH SPOTIFY</Text>
      </Pressable>
    </SafeAreaView>
  );
};

LoginScreen.navigationOptions = {
  title: "Log In",
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: "center", 
    padding: 20
  },
  logo: {
    marginTop: 50, 
    height: 150, 
    width: 150, 
  },
  musicMapText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  appDescriptionText: {
    fontSize: 18, 
    marginBottom: 10, 
  },
  loginButton: {
    marginTop: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: '#1DB954',
  },
  loginButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});
