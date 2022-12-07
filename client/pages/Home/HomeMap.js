import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { getTrack, getCurrentlyPlayingTrack, getTracksAudioFeatures } from "musicmap/util/SpotifyAPICalls";

let currentSong = { title: "No song", spotifyId: null };

export function HomeMap({
  updateLocationHandler,
  currentLocation,
  currentRoadTripData,
  buttonIsStartRoadtrip,
  updateParentSongHandler,
  createImageViewer,
}) {
  const [permissionStatus, setStatus] = useState(null);
  const [offset, setOffset] = useState(0);
  const [pins, setPins] = useState([]);
  const [isOngoingSession, setIsOngoingSession] = useState(false);

  /**
   * Requests user location permission, runs on first render on a new device
   */
  useEffect(() => {
    (async () => {
      let permission = await Location.requestForegroundPermissionsAsync();
      setStatus(permission);
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
    })();
  }, []);

  /**
   * Real-time user location tracking, runs in the background
   */
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
            updateLocationHandler(location, currentLocation.regionName);
          }
        }
      } catch {
        console.log("ERROR1");
      }
    })();
  });

  /**
   * Manages display of pins on the map based on the status of the session, runs in the background
   */
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
      } catch {
        console.log("ERROR2");
      }
    })();
  });

  /**
   * launches the image picker UI and calls postImage() to handle the chosen image
   */
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      postImage(result.uri);
    }
  };

  /**
   * adds a user-added image pin to the map and records in database
   * @param {the image URL} imageUri 
   */
  const postImage = (imageUri) => {
    console.log("POST Image: " + imageUri);
    const newImage = {
      tripId: currentRoadTripData.createdReview._id,
      imageURL: imageUri,
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude + offset,
        name: currentLocation.name,
      },
      datestamp: new Date().toLocaleString("en-GB"),
    };
    setPins((prevPins) => [...prevPins, newImage]);
    setOffset((prevOffset) => prevOffset + 0.005);

    axios
      .post(`${REACT_APP_BASE_URL}/images/create-image`, newImage)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
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

  /**
   * records song in database
   */
  const postSongHandler = () => {
    axios
      .post(`${REACT_APP_BASE_URL}/songs/create-song`, currentSong)
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

  /**
   * adds song pins to the map and calls postSongHandler() to record song in database
   */
  const addPinHandler = async () => {
    try {
      if (currentLocation == null || currentRoadTripData == null || !isOngoingSession) {
        clearPinsHandler()
        return;
      }
      const song = await getCurrentlyPlayingTrack();
      if (song == null || song.trackID == currentSong.spotifyId) {
        return;
      }
      currentSong.spotifyId = song.trackID;
      const trackInfo = await getTrack(song.trackID);
      const audioFeatures = await getTracksAudioFeatures(song.trackID);
      const newSong = {
        tripId: currentRoadTripData.createdReview._id,
        spotifyId: song.trackID,
        title: song.title,
        artist: song.artist,
        imageURL: song.imageURL,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude + offset,
          name: currentLocation.name,
        },
        songInfo: {
          albumID: trackInfo.albumID,
          albumName: trackInfo.albumName,
          releaseDate: trackInfo.releaseDate,
          trackPopularity: trackInfo.popularity,
          trackPreviewURL: trackInfo.previewURL,
          acousticness: audioFeatures.acousticness,
          danceability: audioFeatures.danceability,
          duration_ms: audioFeatures.duration_ms,
          energy: audioFeatures.energy,
          instrumentalness: audioFeatures.instrumentalness,
          key: audioFeatures.key,
          liveness: audioFeatures.liveness,
          loudness: audioFeatures.loudness,
          mode: audioFeatures.mode,
          speechiness: audioFeatures.speechiness,
          tempo: audioFeatures.tempo,
          timeSignature: audioFeatures.timeSignature,
          valence: audioFeatures.valence,
        },
        datestamp: new Date().toLocaleString("en-GB"),
      };
      currentSong = newSong;
      updateParentSongHandler(currentSong);
      setPins((prevSongs) => [
        ...prevSongs,
        newSong,
      ]);
      setOffset((prevOffset) => prevOffset + 0.005);
      postSongHandler();
    }
    catch {
      console.log("ADD PIN ERROR");
    }
  };

  /**
   * Removes all pins from the map
   */
  const clearPinsHandler = () => {
    setPins([]);
    setOffset(0);
    currentSong = { title: "No song", spotifyId: null };
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {pins.map((item, index) => {
          return isOngoingSession ? (
            <Marker
              key={index}
              pinColor={item.title != null ? "red" : "blue"}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              icon={{ uri: item.imageURL }}
            >
              <Callout
                onPress={() => {
                  if (item.title == null) { // is an image
                    createImageViewer(item);
                  }
                }}
              >
                {item.title != null ? (
                  <View>
                    <Image
                      style={{ alignSelf: "center", width: 50, height: 50 }}
                      source={{ uri: item.imageURL }}
                    />
                    <Text style={{ textAlign: "center" }}>{item.title}</Text>
                    <Text style={{ textAlign: "center" }}>{item.artist}</Text>
                    <Text style={{ textAlign: "center" }}>
                      {item.datestamp}
                    </Text>
                  </View>
                ) : (
                  <Image
                    style={{ alignSelf: "center", width: 50, height: 50 }}
                    source={{ uri: item.imageURL }}
                  />
                )}
              </Callout>
            </Marker>
          ) : null;
        })}
      </MapView>
      <Text style={styles.modalText}>
        {currentLocation ? "" : "Retrieving your location..."}
      </Text>
      {!buttonIsStartRoadtrip ? (
        <Pressable style={styles.addImageButton} onPress={pickImage}>
          <MaterialIcons name="add-photo-alternate" size={28} color="#696969" />
        </Pressable>
      ) : null}
    </>
  );
}
