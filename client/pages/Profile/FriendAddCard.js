import { Text, View, Image, StyleSheet, TouchableHighlight } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";

export const FriendAddCard = ({ name, numFriends, profilePic, userId, friendId }) => {

  const onPress = async (e) => {
    console.log("submitted");
    console.log(userId);
    console.log(name);
    console.log(friendId);
    createFriendRequest(userId, friendId);
  }

  async function createFriendRequest(requestorId, requestedId) {
    console.log("creating friend request");
    console.log("requestor:");
    console.log(requestorId);
    console.log("requested:");
    console.log(requestedId);
    const friendRequest = {
      requestorId: requestorId,
      requestedId: requestedId,
    }
    axios.post(`${REACT_APP_BASE_URL}/friendRequests`, friendRequest).then((response) => {
      console.log("success");
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <View style={styles.friendCardContainer}>
      <Image source={{ uri: profilePic }} style={styles.image} />
      <View style={styles.friendCardContent}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {numFriends} Friends
        </Text>
      </View>
        <TouchableHighlight onPress={onPress} style={styles.button}>
          <Text>Add Friend</Text>
        </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginRight: 30,
    height: 40,
    borderRadius: 6,
  },
});