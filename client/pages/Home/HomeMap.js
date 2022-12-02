import MapView, { Marker, Callout, Polygon } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
//import { getValueFor } from "musicmap/util/SecureStore";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

let currentSong = { title: "No song", spotifyId: null };

export function HomeMap({
  updateLocationHandler,
  currentLocation,
  currentRoadTripData,
  buttonIsStartRoadtrip,
}) {
  const [permissionStatus, setStatus] = useState(null);
  const [offset, setOffset] = useState(0);
  const [pins, setPins] = useState([]);
  // const [currentSong, setCurrentSong] = useState({ title: "No song", spotifyId: null });
  const [isOngoingSession, setIsOngoingSession] = useState(false);

  /**
   * requests permission if needed
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

  // useEffect(() => {
  //   if (currentSong.spotifyId != null) {
  //     postSongHandler();
  //   }
  // }, [currentSong])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      postImage(result.uri);
    }
  };

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

  const getSongFromSpotify = async () => {
    let accessToken = await getAccessTokenFromSecureStorage();
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

  const postSongHandler = () => {
    console.log("POST SONG: " + currentSong.title);
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

  const addPinHandler = async () => {
    if (currentLocation == null || currentRoadTripData == null) {
      return;
    }
    const song = await getSongFromSpotify();
    if (song == null || song.id == currentSong.spotifyId) {
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
    currentSong = newSong;
    // setCurrentSong(newSong);
    setPins((prevPins) => [...prevPins, newSong]);
    setOffset((prevOffset) => prevOffset + 0.005);
    postSongHandler();
  };

  const clearPinsHandler = () => {
    setPins([]);
    setOffset(0);
    currentSong = { title: "No song", spotifyId: null };
    // setCurrentSong({ title: "No song", spotifyId: null });
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {pins.map((item, index) => {
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
      {!buttonIsStartRoadtrip ? (
        <Pressable style={styles.addImageButton} onPress={pickImage}>
          <MaterialIcons name="add-photo-alternate" size={28} color="#696969" />
        </Pressable>
      ) : null}
    </>
  );
}
