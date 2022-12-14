import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Linking, Networking, RefreshControl } from "react-native";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import { deleteValue } from "musicmap/util/SecureStore";
import FriendCard from "musicmap/pages/Profile/FriendCard";
import { FriendSectionHeader } from "./FriendSectionHeader";
import { AddFriendBottomSheet } from "musicmap/pages/Profile/AddFriendBottomSheet";
import { getValueFor } from "../../util/SecureStore";


/**
 * 
 * @returns the user's profile, which displays their spotify profile picture,
 * their name, and their friends
 */
export function ProfileScreen(props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [numFollowers, setNumFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [userId, setUserId] = useState("");
  const [friends, setFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const emptyProfilePic = "abc_dummy.com";

  /**
   * set friends to an empty array when refreshed
   */
  const onRefresh = useCallback(() => {
    console.log("refresh");
    setRefreshing(true);
    setFriends([]);
    setRefreshing(false);
  }, []);

  /**
   * gets the user's Spotify account information from the Spotify API
   */
  async function getUserInfo() {
    const accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response) {
      const responseJson = await response.json();
      if (responseJson.followers == null || responseJson.images == null) {
          return;
      }
      setName(responseJson.display_name);
      setUsername(responseJson.id);
      setNumFollowers(responseJson.followers.total);
      setProfilePic(responseJson.images[0].url);
    } else {
      console.log("getUserInfo request returned no response");
    }
  }

  /**
   * iterates through the user's list of friends
   * & obtains each friend's info
   */
  async function getFriends() {
    if (friends.length == 0) {
      await axios
        .get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${username}`)
        .then(async function (response2) {
          if (response2.data[0]["friends"].length > 0) {
            let friendsInfo = [];
            for (let i = 0; i < response2.data[0]["friends"].length; i++) {
              let userId = response2.data[0]["friends"][i];
              await axios
                .get(`${REACT_APP_BASE_URL}/users?id=${userId}`)
                .then((response) => {
                  friendsInfo.push(response.data[0]);
                });
            }
            setFriends(friendsInfo);
          }
        });
    } else {
      console.log("friends not null");
      console.log(friends);
    }
  }

  /**
   * takes in the user's name, username, number of followers, and profile picture url
   * & creates a new user in the mongodb database with those attributes
   * @param {the user's name on Spotify} name 
   * @param {the user's Spotify username} username 
   * @param {the number of Spotify followers the user has} numFollowers 
   * @param {the url of the user's Spotify profile picture} profilePicUrl 
   */
  async function addUserToMongoDB(name, username, numFollowers, profilePicUrl) {
    let token = await getValueFor("NOTIF_TOKEN");
    const user = {
      name: name,
      spotifyUsername: username,
      numFriends: numFollowers,
      profilePic: profilePicUrl,
      friends: [],
      notificationToken: token,
    };
    axios
      .post(`${REACT_APP_BASE_URL}/users`, user)
      .then((response) => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * checks if the user is not already in the mongodb database
   * (using their Spotify username)
   * before adding them to the database
   * @param {the user's Spotify username} username
   */
  async function addUserIfNew(username) {
    await axios
      .get(`${REACT_APP_BASE_URL}/users/${username}`)
      .then((response) => {
        if (response.data.length === 0) {
          addUserToMongoDB(name, username, numFollowers, profilePic);
        } else {
          setUserId(response.data[0]["_id"])
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * at each render, get the user's info, call addUserIfNew
   * if username and profilePic aren't empty, & get the user's friends
   */
  useEffect(() => {
    (async () => {
      await getUserInfo();
      if (username != "" && profilePic != "") {
        await addUserIfNew(username);
      }
      if (friends.length == 0) {
        await getFriends();
      }
    })();
  });

  /**
   * remove token, show Spotify log out screen, clear cookies, & navigate to login screen
   *  */
  const logOut = async () => {
    props.loginToParent();
    await SecureStore.deleteItemAsync("AUTH_CODE");
    console.log("DELETED AUTH");
    await deleteValue("ACCESS_TOKEN");
    await deleteValue("REFRESH_TOKEN");
    await deleteValue("EXPIRATION_TIME");

    Linking.openURL("https://accounts.spotify.com/en/logout"); // look into redirects?
    Networking.clearCookies(() => { });

    props.navigation.navigate("login");
  };

  /**
   * define bottom sheet modal properties
   */
  const bottomSheetModalRef = useRef(null);

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
        <Image
          style={styles.profilePic}
          source={{
            uri: profilePic ? profilePic : emptyProfilePic,
          }}
        />
        <Text style={styles.userName}> {name} </Text>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{numFollowers}</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>5</Text>
            <Text style={styles.userInfoSubTitle}>Roadtrips</Text>
          </View>
        </View>

        <FriendSectionHeader bottomSheetModalRef={bottomSheetModalRef} />
        {friends.length > 0 ? (
          friends.map((item) => (
            <FriendCard
              name={item.name}
              numFriends={item.numFriends}
              profilePic={item.profilePic}
              key={item.spotifyUsername}
              friendId={item._id}
              userId={userId}
              setFriends={setFriends}
            />
          ))
        ) : (
          <Text>No friends!</Text>
        )}

        <Pressable style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </Pressable>
      </ScrollView>
      <AddFriendBottomSheet bottomSheetModalRef={bottomSheetModalRef} />
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  profilePic: {
    height: 130,
    width: 130,
    borderRadius: 75,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
    marginBottom: 15,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: "#1DB954",
  },
  logoutButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});
