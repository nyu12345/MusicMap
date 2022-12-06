import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { getUserInfo } from "musicmap/util/UserInfo";

export function SentScreen() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [sent, setSent] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    console.log("refresh");
    setRefreshing(true);
    console.log("setting sent to 0");
    setSent([]);
    setRefreshing(false);
  }, []);

  async function getSent() {
    if (sent.length == 0) {
      await axios
        .get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`)
        .then(async function (response) {
          if (response.data.length != 0) {
            let sentInfo = [];
            
            for (let i = 0; i < response.data.length; i++) {
              let response2 = response.data[i];
              let currRequestedId = response2["requestedId"];
              await axios
                .get(`${REACT_APP_BASE_URL}/users?id=${currRequestedId}`)
                .then((response3) => {
                  sentInfo.push(response3.data[0]);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            setSent(sentInfo);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
        setUserId(userInfo[4]);
      }
      if (userId != "") {
        await getSent();
      }
    })();
  });

  const SentRequestCard = ({
    name,
    numFriends,
    profilePic,
    username,
    friendId,
    userId,
  }) => {
    async function deleteFriendRequest(requestorId, requestedId) {
      console.log("deleting friend request");
      await axios
        .get(
          `${REACT_APP_BASE_URL}/friendRequests?requestedId=${requestedId}&requestorId=${requestorId}`
        )
        .then((response) => {
          let requestId = response.data[0]["_id"];
          axios
            .delete(`${REACT_APP_BASE_URL}/friendRequests/${requestId}`)
            .then((response) => {
              setSent([]);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return (
      <View style={styles.friendCardContainer}>
        <Image source={{ uri: profilePic }} style={styles.image} />
        <View style={styles.friendCardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.subTitle}>
            {numFriends} Friends
          </Text>
        </View>
        <Pressable>
          <Text
            style={styles.withdraw}
            onPress={() => {
              deleteFriendRequest(userId, friendId);
            }}
          >
            Withdraw
          </Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sent.length > 0 ? (
          sent.map((item) => (
            <SentRequestCard
              name={item.name}
              numFriends={item.numFriends}
              profilePic={item.profilePic}
              username={item.spotifyUsername}
              friendId={item._id}
              userId={userId}
              key={item.spotifyUsername}
            />
          ))
        ) : (
          <Text>You have not sent any friend requests!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  withdraw: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 18,
  },
});
