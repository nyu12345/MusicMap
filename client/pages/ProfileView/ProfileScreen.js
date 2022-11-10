import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Pressable, 
} from "react-native";
import React, { useEffect, useState } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {
  save,
  getValueFor,
  deleteValue,
  isAvailable,
} from "musicmap/util/SecureStore";
import Icon from "react-native-vector-icons/FontAwesome";
import { Linking, Networking } from "react-native";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import { FriendList } from "musicmap/pages/ProfileView/FriendList"; 
import { FriendCard } from "musicmap/pages/ProfileView/FriendCard"; 

const ProfileScreen = (props) => {
  const [name, setName] = useState("");
  const [numFollowers, setNumFollowers] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const emptyProfilePic = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0BBwqa30flyHoktGHTS7N1&ust=1668122174024000&source=images&cd=vfe&ved=0CA4QjRxqFwoTCKjJvL6dovsCFQAAAAAdAAAAABAE"; 

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
      setName(responseJson.display_name);
      setNumFollowers(responseJson.followers.total);
      setProfilePic(responseJson.images[0].url);

      // TODO:  upload responseJson.id (userId), responseJson.display_name and list of friends to Mongo
    } else {
      console.log("getUserInfo request returned no response");
    }
  }

  useEffect(() => {
    (async () => {
      await getUserInfo();
    })();
  });

  // remove token, show Spotify log out screen, clear cookies & navigate to login screen
  const logOut = async () => {
    props.loginToParent();
    await SecureStore.deleteItemAsync("AUTH_CODE");
    console.log("DELETED AUTH");
    await deleteValue("ACCESS_TOKEN");
    await deleteValue("REFRESH_TOKEN");
    await deleteValue("EXPIRATION_TIME");

    Linking.openURL("https://accounts.spotify.com/en/logout"); // look into redirects?
    Networking.clearCookies(() => {});

    props.navigation.navigate("login");
  };

  const friends = [
    {
        name: "Jeffrey Liu", 
        numFriends: 30, 
        friends: [], 
        profilePic: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg", 
    }, 
    {
        name: "Nathan Huang", 
        numFriends: 29, 
        friends: [], 
        profilePic: "", 
    }, 
  ]

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={{flex: 1, padding: 20}}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
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

        {friends.map((item) => (
          <FriendCard name={item.name} numFriends={item.numFriends} />
        ))}

        <Pressable style={styles.logoutButton} onPress={logOut}>
          <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profilePic: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: '#1DB954',
  },
  logoutButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};