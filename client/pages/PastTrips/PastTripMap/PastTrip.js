import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react"; 
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PastTrip = ({
  tripId,
  name,
  startLocation,
  destination,
  startDate,
  endDate,
  getSongs, 
}) => {
  // const [songs, setSongs] = useState([]); 

  // // get songs played in the selected roadtrip
  // const getSongs = async (tripId) => {
  //   await axios.get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${tripId}`).then((response) => {
  //     setSongs(response.data); 
  //   }).catch((err) => {
  //     console.log(err); 
  //   });
  // };

  return (
    <Pressable
      onPress={() => {
        console.log("selected roadtrip");
        getSongs(tripId); 
      }}
      style={styles.roadtripContainer}
    >
      <Image
        source={require("musicmap/assets/sample_pfp.png")}
        style={styles.image}
      />
      <View style={styles.roadtripContent}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subTitle}>
            {dayjs(startDate).format("MM/DD/YY")} -{" "}
            {dayjs(endDate).format("MM/DD/YY")}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {startLocation}->{destination}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  roadtripContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  roadtripContent: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default PastTrip;
