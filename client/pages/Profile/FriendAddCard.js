import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";

  /**
   * 
   * @param {the name of a user} name
   * @param {the number of friends a user has} numFriends
   * @param {the url of a user's Spotify profile pic} profilePic
   * @param {the username of the friend request requestor} username
   * @param {the id of a user} friendId
   * @param {the current user's id} userId
   * @returns a card that shows information about each person the user can add, with a button to
   * request to add the person
   */
export const FriendAddCard = ({
  name,
  numFriends,
  profilePic,
  userId,
  friendId,
  setDidSendRequest,
}) => {

  /**
   * creates a friend request in the database, with the user as the requestor
   * and the person in the card as the requested
   * @param {the user's id} requestorId 
   * @param {the id of the person the user is requesting} requestedId 
   */
  async function createFriendRequest(requestorId, requestedId) {
    // console.log("creating friend request");
    // console.log("requestor: " + requestorId);
    // console.log("requested: " + requestedId);
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
          {numFriends} Followers
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
