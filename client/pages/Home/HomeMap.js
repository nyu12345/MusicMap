import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image } from "react-native";
import * as Location from "expo-location";

export function HomeMap({ updateLocationHandler, currentLocation }) {
  const [permissionStatus, setStatus] = useState(null);
  const [songLocations, setSongLocations] = useState([]);
  const [currentSong, setCurrentSong] = useState({
    image: "musicmap/assets/lazyfair.jpg",
    title: "Sour Patch Kids",
    artist: "Bryce Vine"
  });
  /**
   * requests permission if needed
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

  const addSongLocation = () => {
    setSongLocations((prevSongLocations) => {
        const newSongLocations = Array.from(prevSongLocations);
        newSongLocations.push(currentSong);
        return newSongLocations;
      }
    );
  }

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {currentLocation ? (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude
            }}
          >
            <Callout>
              <Image style={{ alignSelf: 'center', width: 50, height: 50 }}
                source={require(currentSong.image)} />
              <Text style={{ textAlign: 'center' }}>currentSong.title</Text>
              <Text style={{ textAlign: 'center' }}>currentSong.artist</Text>
            </Callout>
          </Marker>
        )
          : null}
      </MapView>
      <Text style={styles.modalText}>{
        currentLocation
          ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude}) \n ${currentLocation.name}`
          : "Retrieving your location..."
      }</Text>
    </>
  );
}
