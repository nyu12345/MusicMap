import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

  /**
   * 
   * @param {the name of the friend} name
   * @param {the number of friends the friend has} numFriends
   * @param {the url of the friend's Spotify profile pic} profilePic
   * @returns a card that shows information about a friend of the user
   */
const FriendCard = ({ name, numFriends, profilePic }) => {
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
});