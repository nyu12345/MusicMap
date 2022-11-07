import MapView from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import * as Location from "expo-location";

export function HomeMap({ updateLocationHandler, currentLocation }) {
  const [permissionStatus, setStatus] = useState(null);

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
          let regionName = await Location.reverseGeocodeAsync({ longitude: location.coords.longitude, latitude: location.coords.latitude });
          if (regionName) {
            updateLocationHandler(location, regionName);
          }
        }
      }
    })()
  });

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      ></MapView>
      <Text style={styles.modalText}>{
        currentLocation
          ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude}) \n ${currentLocation.name}`
          : "Retrieving your location..."
      }</Text>
    </>
  );
}
