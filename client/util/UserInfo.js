import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";

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
        console.log("responseJson:");
        console.log(responseJson);
        const response2 = await axios.get(`${REACT_APP_BASE_URL}/users/${responseJson.id}`);
        if (response2) {
            console.log("response2:")
            console.log(response2);
            console.log(response2.data[0]["_id"]);
            return [responseJson.display_name, responseJson.id, responseJson.followers.total, responseJson.images[0].url, response2.data[0]["_id"]]
        } else {
            console.log("getUserId request returned no response");
        }
    } else {
        console.log("getUserInfo request returned no response");
    }
} 