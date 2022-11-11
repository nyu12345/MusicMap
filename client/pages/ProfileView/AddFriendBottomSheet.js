import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [searchInput, setSearchInput] = useState("");

  // Points for the bottom sheet to snap to, sorted from bottom to top
  const snapPoints = useMemo(() => ["15%", "50%", "75%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

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
});
