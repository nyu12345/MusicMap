import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
  RefreshControl
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    console.log("refresh");
    setRefreshing(true);
    setReceived([]);
    setRefreshing(false);
  }, []);

  async function getReceived(userId) {
    if (received.length == 0) {
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestedId=${userId}`).then(async function (response) {
        if (response.data.length != 0) {
          let receivedInfo = []
          for (let i = 0; i < response.data.length; i++) {
            let response2 = response.data[i];
            let currRequestorId = response2["requestorId"];
            await axios.get(`${REACT_APP_BASE_URL}/users?id=${currRequestorId}`).then((response3) => {
              receivedInfo.push(response3.data[0])
            }).catch((err) => {
              console.log(err);
            })
          }
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
      if (userInfo.length > 4) {
        setUsername(userInfo[1]);
        setUserId(userInfo[4])
      }
      if (userId != "") {
        console.log("getting received")
        await getReceived(userId);
      }
    })();
  });

  const ReceivedRequestCard = ({ name, numFriends, profilePic, username, friendId, userId }) => {

    const onPress = async (e) => {
      console.log("accepting request")
      const data = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${friendId}`);
      console.log("data:")
      console.log(data);
      const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${friendId}?friendId=${userId}`);
      console.log("data2:")
      console.log(data2);
      deleteFriendRequest(friendId, userId)
    }

    async function deleteFriendRequest(requestorId, requestedId) {
      console.log("deleting friend request");
      await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestedId=${requestedId}&requestorId=${requestorId}`).then((response) => {
        let requestId = response.data[0]["_id"];
        axios.delete(`${REACT_APP_BASE_URL}/friendRequests/${requestId}`).then((response) => {
          setReceived([]);
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    }

    return (
      <View style={styles.friendCardContainer}>
        <Image source={{ uri: profilePic }} style={styles.image} />
        <View style={styles.friendCardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
          </View>
          <Text numberOfLines={2} style={styles.subTitle}>
            {numFriends} Friends
          </Text>
        </View>
        <Pressable>
          <AntDesign name="closecircleo" size={36} color="black" style={styles.icons} onPress={() => { deleteFriendRequest(friendId, userId) }} />
        </Pressable>
        <Pressable>
          <AntDesign name="checkcircleo" size={36} color="black" onPress={onPress} />
        </Pressable>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {(received.length > 0) ? received.map((item) => (
          <ReceivedRequestCard name={item.name} numFriends={item.numFriends} profilePic={item.profilePic} username={item.spotifyUsername} friendId={item._id} userId={userId} key={item.spotifyUsername} />
        )) : <Text>You have not received any friend requests!</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  friendCardContent: {
    flex: 1,
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