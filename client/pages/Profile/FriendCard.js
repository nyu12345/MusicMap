import React from "react";
import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';

  /**
   * 
   * @param {the name of the friend} name
   * @param {the number of friends the friend has} numFriends
   * @param {the url of the friend's Spotify profile pic} profilePic
   * @returns a card that shows information about a friend of the user
   */
const FriendCard = ({ name, numFriends, profilePic, friendId, userId, setFriends }) => {

  const onPress = async (e) => {
    const data = await axios.patch(`${REACT_APP_BASE_URL}/users/remove-friend/${userId}?friendId=${friendId}`);
    const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/remove-friend/${friendId}?friendId=${userId}`);
    setFriends([]);
  }

  return (
    <View style={styles.friendCardContainer}>
      <Image source={{ uri: profilePic }} style={styles.image} />
      <View style={styles.friendCardContent}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {numFriends} Followers
        </Text>
      </View>
      <Pressable>
          <AntDesign name="close" size={15} color="black" style={styles.delete} onPress={onPress} />
        </Pressable>
    </View>
  );
};

export default React.memo(FriendCard); 

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
  delete: {
    marginTop: 20,
    marginRight: 15,
    color: "#b50000",
    fontWeight: "bold",
  },
});