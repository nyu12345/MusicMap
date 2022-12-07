import { Text, View, Image, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

dayjs.extend(relativeTime);

const PastTrip = ({
  tripId,
  username,
  name,
  startLocation,
  destination,
  startDate,
  endDate,
  getSongs,
  getRoadtrips,
  selectedTripId,
  setSelectedTripId,
  setSelectedTripImages,
}) => {
  const [images, setImages] = useState([]);
  const [coverPic, setCoverPic] = useState("https://reneeroaming.com/wp-content/uploads/2020/08/Best-National-Park-Road-Trip-Itinerary-Grand-Teton-National-Park-Van-Life-819x1024.jpg");

  // get images for current trip
  const getImages = async (tripId) => {
    console.log("tripId: " + tripId);
    await axios
      .get(`${REACT_APP_BASE_URL}/images/get-trip-images/${tripId}`)
      .then((response) => {
        if (response.data.length > 0) {
          console.log("getImages images: " + JSON.stringify(response.data))
          setImages(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRoadtrip = async (tripId) => {
    await axios
      .patch(
        `${REACT_APP_BASE_URL}/users/delete-user-roadtrip/${username}`,
        { roadtripId: tripId, }
      )
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });

    await getRoadtrips();
  };

  // alert when trying to delete roadtrip
  const createAlert = () => {
    Alert.alert(
      "Are you sure you want to delete this roadtrip?",
      "This action is irreversible",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Roadtrip Deletion"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            console.log("delete selected");
            deleteRoadtrip(tripId);
            getRoadtrips();
          },
        },
      ]
    );
  };

  // render action involved with trip deletion when swiping past trip to the right 
  const renderRightActions = () => {
    return (
      <Pressable
        onPress={() => {
          createAlert();
        }}
        style={styles.deleteButton}
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </Pressable>
    );
  };

  // initial rendering - get profile pic for roadtrip
  useEffect(() => {
    getImages(tripId);
  }, []);

  // set cover image
  useEffect(() => {
    if (images.length != 0) {
      setCoverPic(images[0].imageURL);
    }
  }, [images]);

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable
        onPress={async () => {
          console.log("selected roadtrip");
          setSelectedTripId(tripId);
          await getSongs(tripId);
          setSelectedTripImages(images);
        }}
        style={tripId === selectedTripId ? styles.selectedRoadtripContainer : styles.roadtripContainer}
      >
        <Image
          source={{ uri: coverPic }}
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
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  roadtripContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    borderRadius: 5,
  },
  selectedRoadtripContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 5,
  },
  image: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  roadtripContent: {
    flex: 1,
    top: 5,
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
  deleteButton: {
    backgroundColor: "red",
    height: "95%",
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(PastTrip);
