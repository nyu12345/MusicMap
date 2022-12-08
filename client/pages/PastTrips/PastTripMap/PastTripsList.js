import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import PastTrip from "musicmap/pages/PastTrips/PastTripMap/PastTrip";

export function PastTripsList({ getSongs, setSelectedTripImages }) {
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState("");
  const [roadtrips, setRoadtrips] = useState([]);
  const [roadtripIds, setRoadtripIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");

  // get roadtrip data from API
  const getRoadtrips = async () => {
    await getUserRoadtripIds(username);
    await getUserRoadtrips(roadtripIds);
  };

  // get all the roadtrips the current user has been on
  // 1. get current user's username
  const getUsername = async () => {
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
    } else {
      console.log("getUserInfo request returned no response");
    }
  };

  // 2. get current user's info from Mongo with username and then get user's road trip ids
  const getUserRoadtripIds = async (username) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/users/${username}`)
      .then((response) => {
        setRoadtripIds(response.data[0].roadtrips);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 3. get all road trip information from the road trip ids
  const getUserRoadtrips = async (roadtripIds) => {
    // remove duplicate road trips
    const roadtripSet = new Set();
    for (let i = 0; i < roadtripIds.length; i++) {
      roadtripSet.add(roadtripIds[i]);
    }

    const uniqueRoadtripIds = [];
    roadtripSet.forEach((trip) => uniqueRoadtripIds.push(trip));

    console.log("size of roadtripSet: " + roadtripSet.size);

    // get road trip info for all unique road trips
    const uniqueRoadtrips = [];
    for (let i = 0; i < uniqueRoadtripIds.length; i++) {
      const curTripId = uniqueRoadtripIds[i];
      await axios
        .get(`${REACT_APP_BASE_URL}/roadtrips/${curTripId}`)
        .then((response) => {
          uniqueRoadtrips.push(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setRoadtrips(uniqueRoadtrips);
  };

  // initial rendering
  useEffect(() => {
    getUsername();
    setRefreshing(true);
  }, []);

  // after getUsername from initial rendering, get roadtrips using that username
  useEffect(() => {
    (async () => {
      if (username != "") {
        getRoadtrips();
        setRefreshing(false);
      }
    })();
  }, [username]);

  // get roadtrip data from API upon refresh
  useEffect(() => {
    (async () => {
      if (username != "" && roadtrips.length == 0 && refreshing) {
        getRoadtrips();
        setRefreshing(false);
      }
    })();
  }, [roadtrips]);

  // configure bottom sheet
  const bottomSheetRef = useRef(null);

  // Points for the bottom sheet to snap to, sorted from bottom to top
  const snapPoints = useMemo(() => ["19%", "50%", "95%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleRefresh = useCallback(() => {
    console.log("handleRefresh");
    setRoadtrips([]);
    setRefreshing(true);
  }, []);

  // handle search (search by name, startLocation and destination)
  const filter = (roadtrips) => {
    if (searchInput == "") {
      return roadtrips;
    }
    return roadtrips.filter(function ({ name, startLocation, destination }) {
      // assumption: name, startLocation and destination exist for all roadtrips
      // currently destination can be null if app exits/reruns before roadtrip is cancelled/ended
      if (name === null || startLocation === null || destination === null) {
        return false;
      }
      let input = searchInput.toLowerCase().replace(/\s/g, "");
      const nameArr = name.split(" ");
      const startLocationArr = startLocation.split(" ");
      const destinationArr = destination.split(" ");

      for (let i = 0; i < nameArr.length; i++) {
        nameArr[i] = nameArr[i].toLowerCase();
        if (nameArr[i].indexOf(input) == 0) {
          return true;
        }
      }

      for (let i = 0; i < startLocationArr.length; i++) {
        startLocationArr[i] = startLocationArr[i].toLowerCase();
        if (startLocationArr[i].indexOf(input) == 0) {
          return true;
        }
      }

      for (let i = 0; i < destinationArr.length; i++) {
        destinationArr[i] = destinationArr[i].toLowerCase();
        if (destinationArr[i].indexOf(input) == 0) {
          return true;
        }
      }

      return (
        nameArr.join("").indexOf(input) == 0 ||
        startLocationArr.join("").indexOf(input) == 0 ||
        destinationArr.join("").indexOf(input) == 0
      );
    });
  };

  // render past trip
  const renderItem = ({ item }) => (
    <PastTrip
      tripId={item._id}
      name={item.name}
      username={username}
      startLocation={item.startLocation}
      destination={item.destination}
      startDate={item.startDate}
      endDate={item.endDate}
      getSongs={getSongs}
      getRoadtrips={getRoadtrips}
      selectedTripId={selectedTripId}
      setSelectedTripId={setSelectedTripId}
      setSelectedTripImages={setSelectedTripImages}
    />
  );

  // render empty component (when no roadtrips are available)
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text style={{ fontSize: 15 }}>No roadtrips at the moment :(</Text>
      <Text style={{ fontSize: 15 }}>
        Go out there to explore and make more memories!
      </Text>
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      keyboardBehavior="fillParent"
    >
      <BottomSheetTextInput
        placeholder="Search by date, song, people, or location"
        onChangeText={setSearchInput}
        value={searchInput}
        style={styles.textInput}
      />
      <BottomSheetFlatList
        data={filter(roadtrips, searchInput)}
        extraData={selectedTripId}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        keyExtractor={(item) => item._id}
        //refreshing={roadtrips.length == 0}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={{ backgroundColor: "white" }}
        contentContainerStyle={{ backgroundColor: "white" }}
      />
    </BottomSheet>
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
  emptyText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
