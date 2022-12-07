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

/**
 * 
 * @returns a page that displays all the friend requests the user has received
 */
export function ReceivedScreen() {

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [received, setReceived] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * set received requests to empty when refreshed
   * to update
   */
  const onRefresh = React.useCallback(() => {
    console.log("refresh");
    setRefreshing(true);
    setReceived([]);
    setRefreshing(false);
  }, []);

  /**
   * gets all friend requests the user has received
   * and gets each requestor's information
   * @param {the user's _id} userId 
   */
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

  /**
   * at each render, get the user's info to obtain their username and id,
   * & get the user's received requests
   */
  useEffect(() => {
    (async () => {
      let userInfo = await getUserInfo();
      if (userInfo.length > 4) {
        setUsername(userInfo[1]);
        setUserId(userInfo[4])
      }
      if (userId != "") {
        await getReceived(userId);
      }
    })();
  });

  /**
   * 
   * @param {the name of the friend request requestor} name
   * @param {the number of friends the friend request requestor has} numFriends
   * @param {the url of the friend request requestor's Spotify profile pic} profilePic
   * @param {the username of the friend request requestor} username
   * @param {the id of the friend request requestor} friendId
   * @param {the user's id} userId
   * @returns a card that shows information about each person who has requested the user
   */
  const ReceivedRequestCard = ({ name, numFriends, profilePic, username, friendId, userId }) => {

    /**
     * when the user accepts the friend request, add each user to the other's friend list
     * and delete the friend request
     */
    const onPress = async (e) => {
      // console.log("accepting request")
      const data = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${friendId}`);
      // console.log("data:")
      // console.log(data);
      const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${friendId}?friendId=${userId}`);
      // console.log("data2:")
      // console.log(data2);
      deleteFriendRequest(friendId, userId)
    }

    /**
     * deletes the friend request from the mongodb database
     * gets called when the user both accepts and rejects the friend request
     * @param {the id of the friend request requestor} requestorId 
     * @param {the user's id} requestedId 
     */
    async function deleteFriendRequest(requestorId, requestedId) {
      // console.log("deleting friend request");
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