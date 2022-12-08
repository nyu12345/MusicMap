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

/**
 * 
 * @param {bottom sheet modal property} bottomSheetModalref
 * @returns the bottom sheet that displays all the users the user
 * can add
 */
export const AddFriendBottomSheet = ({ bottomSheetModalRef }) => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [didSendRequest, setDidSendRequest] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

/**
 * gets all users in the database
 */
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

  /**
   * gets all frined requests the user has sent
   */
  async function getSent() {
    await axios
      .get(`${REACT_APP_BASE_URL}/friendRequests?requestorId=${userId}`)
      .then(async function (response) {
        setSentRequests(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

    /**
     * gets all friend requests the user has received
     */
    async function getReceived() {
      await axios
        .get(`${REACT_APP_BASE_URL}/friendRequests?requestedId=${userId}`)
        .then(async function (response) {
          setReceivedRequests(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  /**
   * gets all friends the user has
   */
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

  /**
   * handles the user moving the bottom sheet
   */
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  /**
   * refreshing
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const popUp = useRef(null);

  /**
   * points for the bottom sheet to snap to, sorted from bottom to top
   */
  const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

  /**
   * filters each user. removes them if they are the current user,
   * if the user has already sent them a friend request,
   * if they have already sent the user a friend request,
   * if they are already friends with the user,
   * and if their name doesn't match the search input
   * @param {all users in the database} users 
   * @returns true if the user passes the filter, false otherwise
   */
  const filter = (users) => {
    return users.filter(function ({ name, _id }) {
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
      if (receivedRequests.length > 0) {
        for (let i = 0; i < receivedRequests.length; i++) {
          if (receivedRequests[i]["requestorId"] == _id) {
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

  /**
   * passes in each user's attributes into the FriendAddCard as parameters
   * @param {each user} item
   */
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


  /**
   * 
   * @returns empty component (no users available yet)
   */
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text>No users at the moment</Text>
    </View>
  );

  /**
   * gets all the users in the database,
   * all the users the user has sent requests to,
   * all the users the user has received requests from,
   * and all the users the user is friends with
   */
  const getFriendAndRequestInfo = async () => {
    await getUsers();
    await getSent();
    await getReceived();
    await getFriends();
  };

  /**
   * initial rendering (will run only once)
   */
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

  /**
   * second use effect, gets the user's friends and friend request
   * info after obtaining the user's username and userid
   */
  useEffect(() => {
    console.log("in second useEffect");
    console.log("set username: " + username);
    console.log("set user Id: " + userId);
    getFriendAndRequestInfo();
  }, [username, userId])

  /**
   * gets called once the sheet is refreshed, and
   * updates the user's friends and friend requests
   */
  useEffect(() => {
    (async () => {
      console.log("sent request addfriend")
      console.log(sentRequests)
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
