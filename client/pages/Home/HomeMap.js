import MapView from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

export function HomeMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionStatus, setStatus] = useState(null);

  // map size parameters
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = 0.0421;

  /**
   * requests permission if needed and sets up initial location
   */
  useEffect(() => {
    (async () => {
      permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatus("Permission to access location was denied");
        return;
      } else {
        setStatus(permission);
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 10000,
          distanceInterval: 0,
        });
        updateLocation(location);
      }
    })();
  });

  /**
   * update's the current location of the user
   * @param {Location.LocationObject} newLocation the new location
   */
  const updateLocation = (newLocation) => {
    if (newLocation) {
      console.log(
        `dX: ${newLocation.coords.latitude - currentLocation.coords.latitude}, dY: ${newLocation.coords.longitude - currentLocation.coords.longitude}`
        );
      setCurrentLocation({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  let text = currentLocation
    ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude})`
    : "Please wait while we retrieve your location...";

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      ></MapView>
      <Text style={styles.modalText}>{text}</Text>
    </>
  );
}
