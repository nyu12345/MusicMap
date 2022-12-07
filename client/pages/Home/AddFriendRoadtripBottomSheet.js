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
import { FriendAddtoRoadtripCard } from "musicmap/pages/Home/FriendAddtoRoadtripCard";
import { getUserInfo } from "musicmap/util/UserInfo";

export const AddFriendRoadtripBottomSheet = ({
  bottomSheetModalRef,
  roadtripId,
  users, 
  getUsers, 
}) => {
  //const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [didSendRequest, setDidSendRequest] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // get all users in the database
  // async function getUsers() {
  //   await axios
  //     .get(`${REACT_APP_BASE_URL}/users/`)
  //     .then((response) => {
  //       setUsers(response.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

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
      if (!friends.includes(_id)) {
        return false;
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
    <FriendAddtoRoadtripCard
      username={item.spotifyUsername}
      name={item.name}
      profilePic={item.profilePic}
      roadtripId={roadtripId}
      getUsers={getUsers}
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
    await getFriends();
  };

  // initial rendering (will run only once)
  useEffect(() => {
    (async () => {
      let userInfo = await getUserInfo();
      if (userInfo.length > 4) {
        console.log("user info: " + userInfo);
        console.log("user name ahhh: " + userInfo[1]);
        console.log("user id ahhhh: " + userInfo[4]);
        setUsername(userInfo[1]);
        setUserId(userInfo[4]);
        console.log("in first useEffect");
        console.log("set username: " + username);
        console.log("set user Id: " + userId);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("in second useEffect");
    console.log("set username: " + username);
    console.log("set user Id: " + userId);
    getFriendAndRequestInfo();
  }, [username, userId]);

  useEffect(() => {
    (async () => {
      console.log("sent request addfriend");
      console.log(sentRequests);
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
