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

  // requests permission if needed and sets up initial location
  useEffect(() => {
    (async () => {
      permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setStatus("Permission to access location was denied");
        return;
      } else {
        console.log("Access granted!!");
        setStatus(permission);
        let initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 200,
          distanceInterval: 0,
        });
        updateLocation(initialLocation);
      }
    })();
  }, []);

  const updateLocation = (newLocation) => {
    if (newLocation) {
      setCurrentLocation({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  let text = currentLocation
    ? `coords: ${currentLocation.latitude}, ${currentLocation.longitude}`
    : "waiting...";

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
