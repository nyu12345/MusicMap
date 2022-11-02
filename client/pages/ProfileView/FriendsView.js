import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";

export function FriendsScreen() {
  const [username, setUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [newFriendId, setNewFriendId] = useState("");
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setFriends([]);
  }, []);
  // TODO: change logic to make get request when we pull to refresh
  if (friends.length == 0 || refreshing) {
    axios
      .get(`${REACT_APP_BASE_URL}/users?spotifyUsername=paolo5`)
      .then((response) => {
        console.log("Tried to get data");
        console.log(response.data);
        setUsername(response.data[0]["spotifyUsername"]);
        if (response.data[0]["friends"].length > 0) {
          let friendsList = response.data[0]["friends"];
          console.log("friends:");
          console.log(friendsList);
          const promises = friendsList.map((friend) =>
            axios
              .get(`${REACT_APP_BASE_URL}/users?id=${friend}`)
              .then((response) => {
                return response.data[0]["spotifyUsername"];
              })
          );
          Promise.all(promises).then((data) => {
            console.log("in promises data");
            console.log(data);
            setFriends(data);
          });
        } else {
          console.log("no friends");
          setFriends(["You have no friends!"]);
          console.log(friends);
        }
      }).catch(error => console.log(error));
  } else {
    console.log("printing");
  }

  const submitForm = async (e) => {
    console.log("in submit form");
    console.log(newFriend);
    const data = await axios.get(
      `${REACT_APP_BASE_URL}/users?spotifyUsername=${newFriend}`
    );
    console.log(data);
    if (data.status == 200) {
      console.log("data:");
      console.log(data.data[0]["_id"]);
      setNewFriendId("" + data.data[0]["_id"]);
      console.log("new friend id");
      console.log(newFriendId);
      let newId = data.data[0]["_id"];
      console.log(newId);
      const data2 = await axios.patch(
        `${REACT_APP_BASE_URL}/users/635665a6b41833182330f3a8?friendId=${newId}`
      );
      console.log("data2:");
      console.log(data2);
      setMessage("Added");
    } else {
      setMessage("Something went wrong");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={friends.length == 0}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={{ marginTop: 70 }}>
        <Text style={styles.header}>PROFILE</Text>
        <TouchableOpacity>
          <View style={styles.profileImage}>
            <Image
              source={require("musicmap/assets/profile.jpg")}
              style={styles.image}
              resizeMode="center"
            ></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.userContainer}>
          <Text style={{ fontWeight: "300", fontSize: 36 }}>{username}</Text>
        </View>
        <View style={styles.friendsContainer}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 14,
              fontWeight: "200",
              textAlign: "center",
            }}
          >
            Friends
          </Text>
          <View>
            {friends.map((friend) => (
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: 14,
                    fontWeight: "100",
                    textAlign: "center",
                  }}
                >
                  {friend}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 32,
            fontWeight: "100",
            textAlign: "center",
          }}
        >
          Add Friend
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(value) => setNewFriend(value)}
          onSubmitEditing={(value) => submitForm(value.nativeEvent.text)}
        />
        <Text
          style={{
            fontSize: 16,
            marginTop: 32,
            fontWeight: "100",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    alignSelf: "center",
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  header: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  userContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 14,
  },
  friendsContainer: {
    marginTop: 32,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    marginTop: 12,
    width: "50%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
  },
});
