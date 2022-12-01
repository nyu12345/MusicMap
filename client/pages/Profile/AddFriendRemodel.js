import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { FriendCard } from "musicmap/pages/Profile/FriendCard";

export const AddFriendRemodel = ({ bottomSheetModalRef }) => {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    
    const [page, setPage] = useState(1);
    const [usersToDisplay, setUsersToDisplay] = useState([]);

    if (users.length == 0) {
        console.log("0 users")
        axios.get(`${REACT_APP_BASE_URL}/users/`).then((response) => {
            setUsers(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleRefresh = useCallback(() => {
        setUsers([]);
        console.log("handleRefresh");
    }, []);

    const popUp = useRef(null);

    const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

    const filter = (users) => {
        if (searchInput == "") {
            return users;
        }
        return users.filter(function ({user}) {
            console.log(user);
            if (user == null) {
                return false;
            }
            const users = user.split(" ");
            for (let i = 0; i < users.length; i++) {
                users[i] = users[i].toLowerCase();
                if (users[i].indexOf(input) == 0) {
                return true;
                }
            }
            return (
                users.join("").indexOf(input) == 0
            );
        })
        }
    
    const renderItem = ({ item }) => (
        <FriendCard
        name={item.name}
        />
    );

  // render footer (load more, or signal if reached end of list)
    const renderFooter = () => (
        <View style={styles.footerText}>
          {page < Math.floor(users.length / 10) + 1 && <ActivityIndicator />}
          {page !== 1 && page >= Math.floor(users.length / 10) + 1 && (
            <Text>No more users at the moment</Text>
          )}
        </View>
    );

// render empty component (no roadtrips available yet)
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text>No users at the moment</Text>
    </View>
  );

  const fetchMoreData = () => {
    console.log("fetch more data");
    if (page < Math.floor(users.length / 10) + 1) {
      setPage(page + 1);
      setUsersToDisplay(users.slice(0, 10*page)); 
    }
  };


    useEffect(() => {
        setPage(1); 
        setUsersToDisplay(users.slice(0, 10)); 
    }, [users]); 

    useEffect(() => {
        if (searchInput !== "") {
          setUsersToDisplay(filter(users, searchInput)); 
        } else {
          setUsersToDisplay(users.slice(0, 10*page)); 
        }
    }, [searchInput]); 

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
                        data={usersToDisplay}
                        renderItem={renderItem}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderEmpty}
                        keyExtractor={(item) => item._id}
                        refreshing={users.length == 0}
                        onRefresh={handleRefresh}
                        style={{ backgroundColor: "white" }}
                        contentContainerStyle={{ backgroundColor: "white" }}
                        onEndReachedThreshold={0.2}
                        onEndReached={fetchMoreData}
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
  footerText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  emptyText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
