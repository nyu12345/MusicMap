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

  const getLocation = async () => {
    console.log("CLICKED");
    console.log(permission);
    if (permission.status === "granted") {
      console.log("I HAVE PERMISSION");
      let location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1,
          distanceInterval: 1,
        },
        false,
        (location) => {
          setCurrentLocation(location);
          console.log("update location!", location.coords);
        }
      ).then((response) => {
        console.log(`response: ${response}`);
      });
    }
  };

  const location = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    // <>
    //   {/* <Pressable
    //     style={[styles.cancelButton]}
    //     onPress={watch_location}
    //   ></Pressable> */}
    <MapView
      style={styles.map}
      initialRegion={location}
      showsUserLocation={true}
    ></MapView>
    // </>
    // <View style={styles.container}>
    //   <TouchableOpacity onPress={() => getLocation} style={styles.button}>
    //     <Text style={styles.buttonLabel}>Get Location</Text>
    //   </TouchableOpacity>

    //   {currentLocation && currentLocation.latitude && (
    //     <Text>{currentLocation.latitude}</Text>
    //   )}

    //   {currentLocation && currentLocation.longitude && (
    //     <Text>{currentLocation.longitude}</Text>
    //   )}
    // </View>
  );
}
