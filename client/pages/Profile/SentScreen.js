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
import { getUserInfo } from "musicmap/util/UserInfo";

export function SentScreen() {

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [sent, setSent] = useState([]);
  let sentInfo = [];
  
  async function getSent(userId) {
    if (sent.length == 0) {
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`).then((response) => {
        if (response.data.length != 0) {
          console.log("sent requests:");
          console.log(response.data[0]);
          let currRequestedId = response.data[0]["requestedId"]
          console.log(currRequestedId);
          axios.get(`${REACT_APP_BASE_URL}/users?id=${currRequestedId}`).then((response2) => {
            console.log("sent info");
            console.log(response2.data[0]);
            sentInfo.push(response2.data[0]) 
          }).catch((err) => {
            console.log(err);
          })
          setSent(sentInfo);
        }
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log("sent not null");
      console.log(sent);
    }
  }

  useEffect(() => {
    (async () => {
      let userInfo = await getUserInfo();
      if (userInfo) { 
        setUsername(userInfo[1]);
        setUserId(userInfo[4])
      }
      if (userId != "") { 
        await getSent(userId);
      }
    })();
  });

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