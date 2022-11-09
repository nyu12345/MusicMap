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

  const getSongHandler = async () => {
    let access_token = await getValueFor("ACCESS_TOKEN");
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const responseJson = await response.json();
    console.log(responseJson.item.name);
    console.log(responseJson.item.album.images[0].url);
    console.log(responseJson.item.artists[0].name);
  };

  // useEffect(() => {

  // });

  const addPinHandler = () => {
    if (currentLocation == null) {
      return;
    }
    const currentSongLocation = {
      source: {
        uri: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      },
      title: "Sour Patch Kids",
      artist: "Bryce Vine",
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
                  source={{
                    uri: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
                  }}
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
      <Button onPress={getSongHandler} title="GET SONG" color="#841584" />
    </>
  );
}
