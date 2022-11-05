import React, { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
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

  useEffect(() => {
    //generateCodeVerifier();
    if (response?.type === "success") {
      setAuthCode(response.params.code);
      console.log("success");
      console.log(response.params);
      const tokenResponse = getToken(authCode);
      console.log("response: "); 
      console.log(tokenResponse); 
      // console.log("token response: ");
      // console.log()
    }
  }, [response]);

  // const getTokens = async (authCode) => {
  //   try {
  //     //const credentials = await getSpotifyCredentials() //we wrote this function above (could also run this outside of the functions and store the credentials in local scope)
  //     const credsB64 = new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
  //     const response = await fetch('https://accounts.spotify.com/api/token', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Basic ${credsB64}`,
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${
  //         redirectUri
  //       }`,
  //     });
  //     const responseJson = await response.json();
  //     // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
  //     const {
  //       access_token: accessToken,
  //       refresh_token: refreshToken,
  //       expires_in: expiresIn,
  //     } = responseJson;

  //     const expirationTime = new Date().getTime() + expiresIn * 1000;
  //     console.log(responseJson);
  //     // await setUserData('accessToken', accessToken);
  //     // await setUserData('refreshToken', refreshToken);
  //     // await setUserData('expirationTime', expirationTime);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // get Spotify API access token using authorization code
  const getToken = (authCode) => {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: queryString.stringify({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: makeRedirectUri({
          useProxy: false,
        })
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    }).then(function(response) {
        console.log(response);
    }).catch(function(error) {
      console.log(error); 
    });

    // axios(`https://accounts.spotify.com/api/token`, {
    //   method: "POST", 
    //   headers: {
    //     Authorization: "Basic " + new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   }, 
    //   data: qs.stringify({
    //     grant_type: "authorization_code", 
    //     code: authCode, 
    //     redirect_uri: makeRedirectUri({
    //       useProxy: false, 
    //     }), 
    //   }), 
    // }).then((response) => {
    //   console.log("here is the response: "); 
    //   console.log(response); 
    // }).catch((error) => {
    //   console.log("Here is the error: "); 
    //   console.log(error); 
    // })
    // axios
    //   .post(
    //     "https://accounts.spotify.com/api/token",
    //     qs.stringify({
    //       grant_type: "authorization_code",
    //       code: authCode,
    //       redirect_uri: makeRedirectUri({
    //         useProxy: false,
    //       }),
    //     }),
    //     {
    //       headers: {
    //         "Authorization": 
    //         "Authorization": "Basic " + new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     return response; 
    //   })
    //   .catch((error) => {
    //     console.log(error.response);
    //   });
  };

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
