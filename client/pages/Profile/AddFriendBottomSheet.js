import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { StyleSheet, SafeAreaView, View, TouchableHighlight, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { REACT_APP_BASE_URL } from '@env';
import axios from 'axios';
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";

export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState(""); 
  const [userId, setUserId] = useState("");

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
      setUsername(responseJson.id);
      await axios.get(`${REACT_APP_BASE_URL}/users/${username}`).then((response) => {
        console.log("response: " + response.data[0]["_id"]); 
        setUserId(response.data[0]["_id"]);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("getUserInfo request returned no response");
    }
  }

  useEffect(() => {
    (async () => {
      await getUserInfo();
    })();
  });

  // Points for the bottom sheet to snap to, sorted from bottom to top
  const snapPoints = useMemo(() => ["15%", "50%", "75%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const onPress = async (e) => {
    console.log("submitted")
    console.log(searchInput)
    const data = await axios.get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${searchInput}`);
    if (data.data.length != 0) {
      console.log("valid");
      console.log(data.data);
      let newId = data.data[0]["_id"];
      console.log(newId);
      const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${newId}`);
      console.log("data2:")
      console.log(data2);
    }
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          keyboardBehavior="fillParent"
        >
          <BottomSheetTextInput
            placeholder="Enter your friend's Spotify username!"
            onChangeText={setSearchInput}
            value={searchInput}
            style={styles.textInput}
          />
          <View style={styles.container}>
            <TouchableHighlight onPress={onPress}>
              <View style={styles.button}>
                <Text>Submit</Text>
              </View>
            </TouchableHighlight>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
    color: "black",
    textAlign: "left",
  },
  container: {
    justifyContent: "center",
    paddingHorizontal: 160,
    borderRadius: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
