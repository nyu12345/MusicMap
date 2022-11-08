import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image, Button } from "react-native";
import * as Location from "expo-location";

export function HomeMap({ updateLocationHandler, currentLocation }) {
  const [permissionStatus, setStatus] = useState(null);
  const [offset, incrementOffset] = useState(0);
  const [songLocations, setSongLocations] = useState([]);

  /**
   * requests permission if needed
   */
  useEffect(() => {
    (async () => {
      permission = await Location.requestForegroundPermissionsAsync();
      setStatus(permission);
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
          let regionName = await Location.reverseGeocodeAsync({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          });
          if (regionName) {
            updateLocationHandler(location, regionName);
          }
        }
      }
    })();
  });

  const addPinHandler = () => {
    const currentSongLocation = {
      source: require("musicmap/assets/lazyfair.jpg"),
      title: "Sour Patch Kids",
      artist: "Bryce Vine",
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude - offset,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        name: "Durham, NC",
      },
    };
    setSongLocations((prevSongLocations) => [
      ...prevSongLocations,
      currentSongLocation,
    ]);
    incrementOffset((prevOffset) => prevOffset + 0.01);
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {songLocations.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
            >
              <Callout>
                <Image
                  style={{ alignSelf: "center", width: 50, height: 50 }}
                  source={require("musicmap/assets/lazyfair.jpg")}
                />
                <Text style={{ textAlign: "center" }}>{item.title}</Text>
                <Text style={{ textAlign: "center" }}>{item.artist}</Text>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <Text style={styles.modalText}>
        {currentLocation
          ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude}) \n ${currentLocation.name}`
          : "Retrieving your location..."}
      </Text>
      <Button onPress={addPinHandler} title="ADD PIN" color="#841584" />
    </>
  );
}
