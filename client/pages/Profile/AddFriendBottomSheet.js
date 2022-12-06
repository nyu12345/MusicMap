import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
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

export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [didSendRequest, setDidSendRequest] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // get all users in the database
  async function getUsers() {
    await axios
      .get(`${REACT_APP_BASE_URL}/users/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // get all sent friend requests
  async function getSent() {
    await axios
      .get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`)
      .then((response) => {
        if (response.data.length != 0) {
          setSentRequests(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // get friends of the current user
  async function getFriends() {
    await axios
      .get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${username}`)
      .then(async function (response) {
        if (response.data.length != 0) {
          setFriends(response.data[0]["friends"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const popUp = useRef(null);

  const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

  const filter = (users) => {
    return users.filter(function ({ name, _id }) {
      const names = name.split(" ");
      if (_id == userId) {
        return false;
      }
      if (sentRequests.length > 0) {
        for (let i = 0; i < sentRequests.length; i++) {
          console.log("requestedID poop: " + sentRequests[i]["requestedId"]);
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
      if (searchInput != "") {
        let input = searchInput.toLowerCase().replace(/\s/g, "");
        for (let i = 0; i < names.length; i++) {
          names[i] = names[i].toLowerCase();
          if (names[i].indexOf(input) == 0) {
            return true;
          }
        }

        return names.join("").indexOf(input) == 0;
      }
      return true;
    });
  };

  const renderItem = ({ item }) => (
    <FriendAddCard
      name={item.name}
      numFriends={item.numFriends}
      profilePic={item.profilePic}
      userId={userId}
      friendId={item._id}
      setDidSendRequest={setDidSendRequest}
    />
  );

  // render empty component (no roadtrips available yet)
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text>No users at the moment</Text>
    </View>
  );

  const getFriendAndRequestInfo = async () => {
    await getUsers();
    await getSent();
    await getFriends();
  };

  // initial rendering (will run only once)
  useEffect(() => {
    (async () => {
      let userInfo = await getUserInfo();
      if (userInfo.length > 4) {
        setUsername(userInfo[1]);
        setUserId(userInfo[4]);
      }
      await getFriendAndRequestInfo();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (refreshing) {
        await getFriendAndRequestInfo();
        setRefreshing(false);
      }
      if (didSendRequest) {
        await getFriendAndRequestInfo();
        setDidSendRequest(false);
      }
    })();
  }, [refreshing, didSendRequest]);

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
            onChangeText={setSearchInput}
            value={searchInput}
            style={styles.textInput}
          />
          <BottomSheetFlatList
            data={filter(users, searchInput)}
            extraData={didSendRequest}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            style={{ backgroundColor: "white" }}
            contentContainerStyle={{ backgroundColor: "white" }}
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
