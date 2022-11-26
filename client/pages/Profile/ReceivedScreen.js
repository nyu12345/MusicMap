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
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { getUserInfo } from "musicmap/util/UserInfo";
 
export function ReceivedScreen() {

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [received, setReceived] = useState([]);
  let receivedInfo = [];

  async function getReceived(userId) {
    if (received.length == 0) { 
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestedId=${userId}`).then((response) => {
        if (response.data.length != 0) {
          console.log("received requests:"); 
          console.log(response.data[0]); 
          let currRequestorId = response.data[0]["requestorId"]
          axios.get(`${REACT_APP_BASE_URL}/users?id=${currRequestorId}`).then((response2) => {
            console.log("received info"); 
            console.log(response2.data[0]); 
            receivedInfo.push(response2.data[0]) 
          }).catch((err) => {
            console.log(err); 
          })
          setReceived(receivedInfo);
        }
      }).catch((err) => {
        console.log(err); 
      })
    } else {
      console.log("received not null");
      console.log(received);
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
        await getReceived(userId);
      } 
    })(); 
  });

  const ReceivedRequestCard = ({ name, numFriends, profilePic, username, friendId, userId }) => {

    const onPressX = async (e) => {
      console.log("pressed x")
      console.log(username);
      console.log(friendId);
      console.log(userId);
      deleteFriendRequest(friendId, userId)
      // - if X is clicked, delete the friend request from the database
        // below code is for later - when the requested accepts the request, we add to friends list (make sure to add to both)
        // const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${newId}`);
        // console.log("data2:")
        // console.log(data2);
  
    }
    const onPressCheck = async (e) => {
      console.log("pressed check")
      const data = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${friendId}`);
      console.log("data:")
      console.log(data);
      const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${friendId}?friendId=${userId}`);
      console.log("data2:")
      console.log(data2);
      // theoretically adds each person to the other's friends list, need to add delete functionality
      // deleteFriendRequest(friendId, userId)
      // - if check is clicked, add each person to the other’s friends list, and delete the friend request from the database
    }
  
    async function deleteFriendRequest(requestorId, requestedId) {
      console.log("deleting friend request");
      console.log("requestor:");
      console.log(requestorId);
      console.log("requested:");
      console.log(requestedId);
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestedId=${requestedId}&requestorId=${requestorId}`).then((response) => {
        console.log(response.data[0]);
        let requestId = response.data[0]["_id"];
        console.log(requestId);
        axios.delete(`${REACT_APP_BASE_URL}/friendRequests/${requestId}`).then((response) => {
          console.log("success"); 
          setReceived([]);
        }).catch((err) => {
          console.log(err); 
        })  
      }).catch((err) => {
        console.log(err); 
      })
      // get id of friend request using requestorId and requestedId as parameters
      // test delete route on postman!
      // use this function when both x and check is clicked
    }
  
    return (
      <View style={styles.friendCardContainer}>
        <Image source={{ uri: profilePic }} style={styles.image} />
        <View style={styles.friendCardContent}>
          <View style={styles.cardRow}>
            <View style={styles.cardColumn}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              <Text numberOfLines={2} style={styles.subTitle}>
                {numFriends} Friends
              </Text>
            </View>
            <Pressable> 
              <AntDesign name="closecircleo" size={36} color="black" style={styles.icons} onPress={onPressX} />
            </Pressable>
            <Pressable>
              <AntDesign name="checkcircleo" size={36} color="black" onPress={onPressCheck} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

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
            <Text style={styles.name}>Received Friend Requests</Text>
          </View>
        </View>
        {received.length > 0 ? received.map((item) => (
          <ReceivedRequestCard name={item.name} numFriends={item.numFriends} profilePic={item.profilePic} username={item.spotifyUsername} friendId={item._id} userId={userId} key={item.spotifyUsername} />
        )) : <Text>You have not received any friend requests!</Text>}
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
  friendCardContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  friendCardContent: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  cardRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cardColumn: {
    flexDirection: "column",
    marginRight: 100,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
  icons: {
    marginRight: 10,
  },
});