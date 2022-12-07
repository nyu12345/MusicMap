import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PastTrip from "musicmap/pages/PastTrips/PastTripMap/PastTrip";

export function PastTripsList({ getSongs }) {
  const [roadtrips, setRoadtrips] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  // states for handling FlatList pagination
  const [page, setPage] = useState(1);
  const [tripsToDisplay, setTripsToDisplay] = useState([]);

  // get roadtrip data from API
  const getRoadtrips = () => {
    axios
      .get(`${REACT_APP_BASE_URL}/roadtrips/`)
      .then((response) => {
        setRoadtrips(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get roadtrip data from API upon refresh
  if (roadtrips.length == 0) {
    getRoadtrips();
  }

  // configure bottom sheet
  const bottomSheetRef = useRef(null);

  // Points for the bottom sheet to snap to, sorted from bottom to top
  const snapPoints = useMemo(() => ["13%", "50%", "95%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleRefresh = useCallback(() => {
    setRoadtrips([]);
    console.log("handleRefresh");
  }, []);

  // handle search by name, startLocation and destination
  const filter = (roadtrips) => {
    console.log(searchInput);
    if (searchInput == "") {
      return roadtrips;
    }
    return roadtrips.filter(function ({ name, startLocation, destination }) {
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

  // render past roadtrip
  const renderItem = ({ item }) => (
    <PastTrip
      tripId={item._id}
      name={item.name}
      startLocation={item.startLocation}
      destination={item.destination}
      startDate={item.startDate}
      endDate={item.endDate}
      getSongs={getSongs}
      getRoadtrips={getRoadtrips}
    />
  );

  // render footer (load more, or signal if reached end of list)
  const renderFooter = () => (
    <View style={styles.footerText}>
      {page < Math.floor(roadtrips.length / 10) + 1 && <ActivityIndicator />}
      {page !== 1 && page >= Math.floor(roadtrips.length / 10) + 1 && (
        <Text>No more roadtrips at the moment</Text>
      )}
    </View>
  );

  // render empty component (no roadtrips available yet)
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text>No roadtrips at the moment</Text>
    </View>
  );

  const fetchMoreData = () => {
    console.log("fetch more data");
    if (page < Math.floor(roadtrips.length / 10) + 1) {
      setPage(page + 1);
      setTripsToDisplay(roadtrips.slice(0, 10*page)); 
    }
  };

  // used to set trips to display upon first getting roadtrips data from Mongo
  useEffect(() => {
    setPage(1); 
    setTripsToDisplay(roadtrips.slice(0, 10)); 
  }, [roadtrips]); 

  // search
  useEffect(() => {
    if (searchInput !== "") {
      setTripsToDisplay(filter(roadtrips, searchInput)); 
    } else {
      setTripsToDisplay(roadtrips.slice(0, 10*page)); 
    }
  }, [searchInput]); 

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
        onChangeText={setSearchInput} // look into for setting states
        value={searchInput}
        style={styles.searchTextInput}
      />
      <BottomSheetFlatList
        //data={filter(roadtrips, searchInput)}
        data={tripsToDisplay}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        keyExtractor={(item) => item._id}
        refreshing={roadtrips.length == 0}
        onRefresh={handleRefresh}
        style={{ backgroundColor: "white" }}
        contentContainerStyle={{ backgroundColor: "white" }}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreData}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  searchTextInput: {
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
