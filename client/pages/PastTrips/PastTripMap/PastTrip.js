import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

dayjs.extend(relativeTime);

const PastTrip = ({
  tripId,
  name,
  startLocation,
  destination,
  startDate,
  endDate,
  getSongs,
  getRoadtrips, 
}) => {

  const deleteRoadtrip = async (tripId) => {
    await axios
      .delete(`${REACT_APP_BASE_URL}/roadtrips/delete-roadtrip/${tripId}`)
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
  };

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
          onPress: () => {
            console.log("delete selected");
            deleteRoadtrip(tripId);
            getRoadtrips(); 
          },
        },
      ]
    );
  };

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

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable
        onPress={async () => {
          console.log("selected roadtrip");
          await getSongs(tripId);
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
    </Swipeable>
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
  deleteButton: {
    backgroundColor: "red",
    height: "95%",
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(PastTrip);
