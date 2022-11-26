import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image } from "react-native";
import * as Location from "expo-location";
import { getValueFor } from "musicmap/util/SecureStore";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";

export function HomeMap({ updateLocationHandler, currentLocation, currentRoadTripData }) {
  const [permissionStatus, setStatus] = useState(null);
  const [offset, setOffset] = useState(0);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState({ title: "No song", spotifyId: null });
  const [isOngoingSession, setIsOngoingSession] = useState(false);

  /**
   * requests permission if needed
   */
  useEffect(() => {
    (async () => {
      let permission = await Location.requestForegroundPermissionsAsync();
      setStatus(permission);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
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
            // let regionName = await Location.reverseGeocodeAsync({
            //   longitude: location.coords.longitude,
            //   latitude: location.coords.latitude,
            // });
            // if (regionName) {
              updateLocationHandler(location, "Durham, NC");
            //}
          }
        }
      }
      catch {
        console.log("ERROR1");
      }
    })();
  });

  useEffect(() => {
    (async () => {
      try {
        if (currentRoadTripData != null) {
          setIsOngoingSession(true);
          addPinHandler();
        } else if (isOngoingSession) {
          setIsOngoingSession(false);
          clearPinsHandler();
        }
      }
      catch {
        console.log("ERROR2");
      }
    })();
  });

  // useEffect(() => {
  //   if (currentSong.spotifyId != null) {
  //     postSongHandler();
  //   }
  // }, [currentSong])

  const getSongFromSpotify = async () => {
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
        id: responseJson.item.id,
        title: responseJson.item.name,
        artist: responseJson.item.artists[0].name,
        imageURL: responseJson.item.album.images[0].url,
      };
    }
    console.log("COULD NOT GET SONG :(");
    return null;
  };

  const postSongHandler = (newSong) => {
    if (newSong == currentSong) {
      return;
    }
    console.log("POST SONG: " + newSong.title);
    axios
      .post(`${REACT_APP_BASE_URL}/songs/create-song`, newSong)
      .then((response) => {
        console.log(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const addPinHandler = async () => {
    if (currentLocation == null) {
      return;
    }
    const song = await getSongFromSpotify();
    if (song == null || song.id == currentSong.spotifyId) {
      // console.log("NO NEW SONG CURRENTLY :(");
      return;
    }
    const newSong = {
      tripId: currentRoadTripData.createdReview._id,
      spotifyId: song.id,
      title: song.title,
      artist: song.artist,
      imageURL: song.imageURL,
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude + offset,
        name: currentLocation.name,
      },
      datestamp: new Date().toLocaleString("en-GB"),
    };
    setCurrentSong(newSong);
    setSongs((prevSongs) => [
      ...prevSongs,
      newSong,
    ]);
    setOffset((prevOffset) => prevOffset + 0.005);
    postSongHandler(newSong);
  };

  const clearPinsHandler = () => {
    setSongs([]);
    setOffset(0);
    setCurrentSong({ title: "No song", spotifyId: null });
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {songs.map((item, index) => {
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
    </>
  );
}
