import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image, Button } from "react-native";
import * as Location from "expo-location";
import { getValueFor } from "../../SecureStore";

export function HomeMap({ updateLocationHandler, currentLocation }) {
  const [permissionStatus, setStatus] = useState(null);
  const [offset, setOffset] = useState(0);
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
          timeInterval: 10000,
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

  const getSong = async () => {
    let accessToken = await getValueFor("ACCESS_TOKEN");
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response) {
      const responseJson = await response.json();
      return {
        title: responseJson.item.name,
        artist: responseJson.item.artists[0].name,
        imageURL: responseJson.item.album.images[0].url,
      };
    }
    console.log("COULD NOT GET SONG :(");
    return null;
  };

  // useEffect(() => {

  // });

  const addPinHandler = async () => {
    if (currentLocation == null) {
      return;
    }
    const song = await getSong();
    if (song == null) {
      console.log("NO SONG CURRENTLY :(");
      return;
    }
    const currentSongLocation = {
      imageURL: song.imageURL,
      title: song.title,
      artist: song.artist,
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude - offset,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        name: "Durham, NC",
      },
      datestamp: new Date().toLocaleString("en-GB"),
    };
    setSongLocations((prevSongLocations) => [
      ...prevSongLocations,
      currentSongLocation,
    ]);
    setOffset((prevOffset) => prevOffset + 0.005);
  };

  const clearPinsHandler = () => {
    setSongLocations([]);
    setOffset(0);
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
                  source={{ uri: item.imageURL }}
                />
                <Text style={{ textAlign: "center" }}>{item.title}</Text>
                <Text style={{ textAlign: "center" }}>{item.artist}</Text>
                <Text style={{ textAlign: "center" }}>{item.datestamp}</Text>
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
      <Button onPress={clearPinsHandler} title="CLEAR PINS" color="#841584" />
    </>
  );
}
