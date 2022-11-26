import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export const ReceivedRequestCard = ({ name, numFriends, profilePic }) => {
  const onPressX = async (e) => {
    console.log("pressed x")
    
  }
  const onPressCheck = async (e) => {
    console.log("pressed check")
  }
  return (
    <View style={styles.friendCardContainer}>
      <Image source={{ uri: profilePic }} style={styles.image} />
      <View style={styles.friendCardContent}>
        <View style={styles.row}>
          <View style={styles.column}>
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
  column: {
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