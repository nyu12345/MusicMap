import { Text, View, Image, StyleSheet } from "react-native";

export const FriendCard = ({ name, numFriends }) => {
  return (
    <View style={styles.friendCardContainer}>
      <Image source={require('musicmap/assets/sample_pfp.png')} style={styles.image} />
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
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});