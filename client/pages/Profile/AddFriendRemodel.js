import React, { useCallback, useState, useMemo, useRef } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

export const AddFriendRemodel = ({ bottomSheetModalRef }) => {
    const base_url = `${REACT_APP_BASE_URL}/users/`;
    const [friends, setFriends] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    if (friends.length == 0) {
        axios.get('${REACT_APP_BASE_URL}/friends/').then((response) => {
            setFriends(response.data);
        })
    }

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleRefresh = useCallback(() => {
        setFriends([]);
        console.log("handleRefresh");
    }, []);

    const popUp = useRef(null);

    const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

    const filter = (friends) => {
        if (searchInput == "") {
            return friends;
        }
        return friends.filter(function ({friend}) {
            const friends = friend.split(" ");
            for (let i = 0; i < friends.length; i++) {
                friends[i] = friends[i].toLowerCase();
                if (friends[i].indexOf(input) == 0) {
                return true;
                }
            }
            return (
                friends.join("").indexOf(input) == 0
            );
        })
        }
    
    const renderItem = ({ item }) => (
        <FriendCard
        name={item.name}
        />
    );

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
                        placeholder="Search by name"
                        onChangeText={setSearchInput} // look into for setting states
                        value={searchInput}
                        style={styles.textInput}
                    />
                    <BottomSheetFlatList
                        data={filter(friends, searchInput)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        refreshing={friends.length == 0}
                        onRefresh={handleRefresh}
                        style={{ backgroundColor: "white" }}
                        contentContainerStyle={{ backgroundColor: "white" }}
                    />
                </BottomSheetModal>
            </SafeAreaView>
        </BottomSheetModalProvider>
    );
}

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
