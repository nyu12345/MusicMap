import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";

// get current user's information
export async function getUserInfo() {
  const accessToken = await getAccessTokenFromSecureStorage();

  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response) {
    const responseJson = await response.json();
    const response2 = await axios.get(
      `${REACT_APP_BASE_URL}/users/${responseJson.id}`
    );
    if (response2.data.length > 0) {
      return [
        responseJson.display_name,
        responseJson.id,
        responseJson.followers.total,
        responseJson.images[0].url,
        response2.data[0]["_id"],
      ];
    } else {
      console.log("user id not in database");
      return [
        responseJson.display_name,
        responseJson.id,
        responseJson.followers.total,
        responseJson.images[0].url,
      ];
    }
  } else {
    console.log("getUserInfo request returned no response");
  }
}
