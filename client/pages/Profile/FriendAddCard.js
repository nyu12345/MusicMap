import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";

export const FriendAddCard = ({
  name,
  numFriends,
  profilePic,
  userId,
  friendId,
  setDidSendRequest,
}) => {

  async function createFriendRequest(requestorId, requestedId) {
    console.log("creating friend request");
    console.log("requestor: " + requestorId);
    console.log("requested: " + requestedId);
    const friendRequest = {
      requestorId: requestorId,
      requestedId: requestedId,
    };
    await axios
      .post(`${REACT_APP_BASE_URL}/friendRequests`, friendRequest)
      .then((response) => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
    setDidSendRequest(true); 
  }

  return (
    <View style={styles.friendCardContainer}>
      <Image source={{ uri: profilePic }} style={styles.image} />
      <View style={styles.friendCardContent}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {numFriends} Friends
        </Text>
      </View>
      <TouchableHighlight
        onPress={() => {createFriendRequest(userId, friendId)}}
        style={styles.button}
      >
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
