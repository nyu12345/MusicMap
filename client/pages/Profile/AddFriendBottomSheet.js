import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import { StyleSheet, SafeAreaView, View, TouchableHighlight, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { REACT_APP_BASE_URL } from '@env';
import axios from 'axios';

export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [searchInput, setSearchInput] = useState("");

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
    console.log(data.data[0].length);
    if (data.data[0] != null) {
      console.log("valid");
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
