import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { REACT_APP_BASE_URL } from '@env';
import axios from 'axios';

export function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [friends, setFriends] = useState([]);
  // TODO: change logic to make get request when we pull to refresh
  if (friends.length == 0) {
    axios.get(`${REACT_APP_BASE_URL}/users?spotifyUsername=paolo5`).then((response) => {
      console.log("Tried to get data");
      console.log(response.data);
      setUsername(response.data[0]["spotifyUsername"]);
      if (response.data[0]["friends"] != null) {
        let friendsList = response.data[0]["friends"];
        console.log("friends:");
        console.log(friendsList);
        const promises = friendsList.map(friend =>
          axios.get(`${REACT_APP_BASE_URL}/users?id=${friend}`).then((response) => {
            return response.data[0]["spotifyUsername"]
          }))
        Promise.all(promises).then(data => {
          console.log(data);
          setFriends(data);
        })
      }
    });
  } else {
    console.log('printing');
  }

  return (
    <View style={{ marginTop: 70 }}>
      <Text style={styles.header}>PROFILE</Text>
      <TouchableOpacity>
      <View style={styles.profileImage}>
        <Image source={require("musicmap/assets/profile.jpg")} style={styles.image} resizeMode="center"></Image>
      </View>
      </TouchableOpacity>
      <View style={styles.userContainer}>
        <Text style={{ fontWeight: "300", fontSize: 36 }}>{username}</Text>
      </View>
      <View style={styles.friendsContainer}>
        <Text style={{fontSize: 36, marginTop: 14, fontWeight: "200", textAlign: "center", }}>Friends</Text>
        <View>{friends.map(friend =>
          <TouchableOpacity>
          <Text style={{ fontSize: 24, marginTop: 14, fontWeight: "100", textAlign: "center", }}>{friend}</Text>
          </TouchableOpacity>)}
        </View>
      </View>
    </View>
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
  }
}); 