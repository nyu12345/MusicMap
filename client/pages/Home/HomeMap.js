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
      setStatus(permission)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (permissionStatus == null) return;
      if (!permissionStatus.granted) {
          console.log("Permission to access location was denied");
          return;
        } else {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            timeInterval: 2000,
            distanceInterval: 0,
          });
          if (location) {
            updateLocation(location);
          }
        }
    })()
  });

  /**
   * update's the current location of the user
   * @param {Location.LocationObject} newLocation the new location
   */
  const updateLocation = (newLocation) => {
    if (currentLocation) {
      console.log(
          `dX: ${newLocation.coords.latitude - currentLocation.latitude}, dY: ${newLocation.coords.longitude - currentLocation.longitude}`
          );
    }
    setCurrentLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      ></MapView>
      <Text style={styles.modalText}>{
        currentLocation
        ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude})`
        : "Retrieving your location..."
      }</Text>
    </>
  );
}
