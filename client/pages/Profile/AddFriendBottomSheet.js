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
import { getUserInfo } from "musicmap/util/UserInfo";

export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState(""); 
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      let userInfo = await getUserInfo();
      if (userInfo) {
        setUsername(userInfo[1]); 
        setUserId(userInfo[4])
      }
    })();
  });

  // Points for the bottom sheet to snap to, sorted from bottom to top
  const snapPoints = useMemo(() => ["15%", "50%", "75%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  // when the submit button is pressed, check to see if the searched username 
  // is valid (in our database). if so, create a friend request
  // with the current user as the requestor and the searched user as the requested
  const onPress = async (e) => {
    console.log("submitted")
    console.log(searchInput)
    const data = await axios.get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${searchInput}`);
    if (data.data.length != 0) {
      console.log("valid");
      console.log(data.data);
      let newId = data.data[0]["_id"];
      console.log(newId);
      createFriendRequest(userId, newId); // await?

      // below code is for later - when the requested accepts the request, we add to friends list (make sure to add to both)
      // const data2 = await axios.patch(`${REACT_APP_BASE_URL}/users/${userId}?friendId=${newId}`);
      // console.log("data2:")
      // console.log(data2);
    }
  }

  async function createFriendRequest(requestorId, requestedId) {
    console.log("creating friend request");
    console.log("requestor:");
    console.log(requestorId);
    console.log("requested:");
    console.log(requestedId);
    const friendRequest = {
      requestorId: requestorId,
      requestedId: requestedId,
    }
    axios.post(`${REACT_APP_BASE_URL}/friendRequests`, friendRequest).then((response) => {
      console.log("success"); 
    }).catch((err) => {
      console.log(err); 
    })
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
