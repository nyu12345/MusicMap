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
import { FriendAddCard } from "musicmap/pages/Profile/FriendAddCard";
import { getUserInfo } from "musicmap/util/UserInfo";

export const AddFriendRemodel = ({ bottomSheetModalRef }) => {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [sentRequests, setSentRequests] = useState([]);

    const [page, setPage] = useState(1);
    const [usersToDisplay, setUsersToDisplay] = useState([]);
    const [friends, setFriends] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    async function getUsers() {
        if (users.length == 0) {
            await axios.get(`${REACT_APP_BASE_URL}/users/`).then((response) => {
                setUsers(response.data);
            })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    async function getSent() {
        if (sentRequests.length == 0) {
            await axios.get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`).then((response) => {
                if (response.data.length != 0) {
                    setSentRequests(response.data);
                }
            })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    async function getFriends() {
        if (friends.length == 0) {
            await axios.get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${username}`).then(async function (response) {
                if (response.data.length != 0) {
                    setFriends(response.data[0]["friends"]);
                }
            })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setSentRequests([]);
        setUsers([]);
        setFriends([]);
        setRefreshing(false);
        console.log("handleRefresh");
    }, []);

    const popUp = useRef(null);

    const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

    const filter = (users) => {
        return users.filter(function ({ name, _id }) {
            console.log("filtering")
            let input = searchInput.toLowerCase().replace(/\s/g, "");
            const names = name.split(" ");
            if (_id == userId) {
                return false;
            }
            if (sentRequests.length > 0) {
                for (let i = 0; i < sentRequests.length; i++) {
                    if (sentRequests[i]["requestedId"] == _id) {
                        return false;
                    }
                }
            }
            if (friends.length > 0) {
                for (let i = 0; i < friends.length; i++) {
                    if (friends[i] == _id) {
                        return false;
                    }
                }
            }
            for (let i = 0; i < names.length; i++) {
                names[i] = names[i].toLowerCase();
                if (names[i].indexOf(input) == 0) {
                    return true;
                }
            }
            return (
                names.join("").indexOf(input) == 0
            );
        })
    }

    const renderItem = ({ item }) => (
        <FriendAddCard
            name={item.name}
            numFriends={item.numFriends}
            profilePic={item.profilePic}
            userId={userId}
            friendId={item._id}
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
        }
        setUsersToDisplay(filter(users, searchInput));
    };

    useEffect(() => {
        (async () => {
            let userInfo = await getUserInfo();
            if (userInfo.length > 4) {
                setUsername(userInfo[1]);
                setUserId(userInfo[4])
            }
            await getUsers().then(await getSent().then(await getFriends()));
        })();
    });

    useEffect(() => {
        (async () => {
            let userInfo = await getUserInfo();
            if (userInfo.length > 4) {
                setUsername(userInfo[1]);
                setUserId(userInfo[4])
            }
            await getUsers().then(await getSent().then(await getFriends()));
        })();
        setPage(1);
        setUsersToDisplay(filter(users, searchInput));
    }, [users]);

    useEffect(() => {
        (async () => {
            let userInfo = await getUserInfo();
            if (userInfo.length > 4) {
                setUsername(userInfo[1]);
                setUserId(userInfo[4])
            }
            await getUsers().then(await getSent().then(await getFriends()));
        })();
        if (searchInput !== "") {
            console.log("filtering")
            setUsersToDisplay(filter(users, searchInput));
        } else {
            setUsersToDisplay(filter(users, searchInput));
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
                        refreshing={refreshing}
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
