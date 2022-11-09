import { Buffer } from "buffer";
import { save, getValueFor, isAvailable } from "musicmap/util/SecureStore";
import { makeRedirectUri } from "expo-auth-session";
import { REACT_APP_BASE_URL, CLIENT_ID, CLIENT_SECRET } from "@env";

// get Spotify API access token using authorization code
export async function getAccessToken(authCode, props) {
  //const authCode = await getValueFor("AUTH_CODE");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${makeRedirectUri(
      {
        useProxy: false,
      }
    )}`,
  });

  const responseJson = await response.json();
  console.log("access token fetch response: ");
  console.log(responseJson);
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
  } = await responseJson;

  const expirationTime = await (
    new Date().getTime() +
    expiresIn * 1000
  ).toString();

  await save("ACCESS_TOKEN", accessToken);
  await save("REFRESH_TOKEN", refreshToken);
  await save("EXPIRATION_TIME", expirationTime);

  const secureStoreToken = await getValueFor("ACCESS_TOKEN");
  props.navigation.navigate(accessToken ? "loggedin" : "login");
}

// call this to get refresh tokens and new access tokens before every Spotify API call
export async function getRefreshTokens() {
  try {
    const refreshToken = await getValueFor("REFRESH_TOKEN");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getAccessToken();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await save("ACCESS_TOKEN", newAccessToken);

      if (newRefreshToken) {
        await save("REFRESH_TOKEN", newRefreshToken);
      }
      await save("EXPIRATION_TIME", expirationTime);
    }
  } catch (err) {
    console.error(err);
  }
}