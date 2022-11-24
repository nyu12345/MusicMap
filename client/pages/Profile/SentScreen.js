import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FriendCard } from "musicmap/pages/Profile/FriendCard";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";

export function SentScreen() {

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [sent, setSent] = useState([]);
  let sentInfo = [];

  async function getUserInfo() {
    const accessToken = await getAccessTokenFromSecureStorage();

    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response) {
      const responseJson = await response.json();
      setUsername(responseJson.id);
      await axios.get(`${REACT_APP_BASE_URL}/users/${username}`).then((response) => {
        console.log("response: " + response.data[0]["_id"]);
        setUserId(response.data[0]["_id"]);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("getUserInfo request returned no response");
    }
  }

  async function getSent(userId) {
    console.log("user id:");
    console.log(userId);
    if (sent.length == 0) {
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`).then((response) => {
        console.log("requests:");
        if (response.data.length != 0) {
          console.log(response.data[0]);
          let currRequestedId = response.data[0]["requestedId"]
          console.log(currRequestedId);
          axios.get(`${REACT_APP_BASE_URL}/users?id=${currRequestedId}`).then((response2) => {
            console.log("sent info");
            console.log(response2.data[0]);
            sentInfo.push(response2.data[0])
          })
          setSent(sentInfo);
        }
        // console.log(response2.data[0]["friends"]); 
        // if (response2.data[0]["friends"].length > 0) { 
        //   response2.data[0]["friends"].map(async (userId) =>
        //       await axios.get(`${REACT_APP_BASE_URL}/users?id=${userId}`).then((response) => {
        //         console.log("friends info");
        //         console.log(response.data[0]);
        //         friendsInfo.push(response.data[0]) 
        //       }) 
        //   );  
        //   console.log("after axios");
        //   setFriends(friendsInfo);   
        //   console.log(friendsInfo);
        // }
      })
    } else {
      console.log("sent not null");
      console.log(sent);
    }
  }

  useEffect(() => {
    (async () => {
      await getUserInfo();
      await getSent(userId);
    })();
  });


  // dummy data
  const friends = [
    {
      name: "Jeffrey Liu",
      numFriends: 30,
      spotifyUsername: "jzl",
      friends: [],
      profilePic: "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
    {
      name: "Nathan Huang",
      numFriends: 29,
      spotifyUsername: "nhu",
      friends: [],
      profilePic: "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.row}>
            <Text style={styles.name}>Sent Friend Requests</Text>
          </View>
        </View>
        {sent.length > 0 ? sent.map((item) => (
          <FriendCard name={item.name} numFriends={item.numFriends} profilePic={item.profilePic} key={item.spotifyUsername} />
        )) : <Text>You have not sent any friend requests!</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  name: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});