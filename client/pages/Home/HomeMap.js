import MapView from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

export function HomeMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  var permission;

  useEffect(() => {
    (async () => {
      permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatus("Permission to access location was denied");
        return;
      } else {
        console.log("Access granted!!");
        setStatus(permission);
      }
    })();
  }, []);

  const getLocation = () => {
    console.log("CLICKED");
    console.log(permission);
    if (permission.status === "granted") {
      console.log("I HAVE PERMISSION");
      let location = Location.getCurrentPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 200,
          distanceInterval: 0,
        },
        false,
        (location) => {
          setCurrentLocation(location);
          console.log("update location!", location.coords);
        }
      )
    }
  };

  const location = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <Pressable
        style={[styles.cancelButton]}
        onPress={getLocation}
      ></Pressable>
    // <MapView
    //   style={styles.map}
    //   initialRegion={location}
    //   showsUserLocation={true}
    // ></MapView>
  );
}
