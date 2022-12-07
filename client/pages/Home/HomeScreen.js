import {
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
  Alert,
  Modal,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "./HomeStyles";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { HomeMap } from "./HomeMap";
import { ImageViewer } from "musicmap/pages/Home/ImageViewer";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";

export function HomeScreen() {
  const [users, setUsers] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageToDisplay, setImageToDisplay] = useState("");
  const [roadtripName, setRoadtripName] = useState("");
  const [buttonIsStartRoadtrip, setButtonIsStartRoadtrip] = useState(true);
  const [currentRoadTripData, setCurrentRoadTripData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentSong, setCurrentSong] = useState({
    title: "No song",
    spotifyId: null,
  });
  const [currentUsername, setCurrentUsername] = useState(null);
  const START_ROADTRIP_BUTTON_TEXT = "Start Roadtrip Session";
  const CANCEL_ROADTRIP_BUTTON_TEXT = "Cancel Roadtrip Session";
  const END_ROADTRIP_BUTTON_TEXT = "End Roadtrip Session";

  const createImageViewer = (item) => {
    setImageViewerVisible(true);
    setImageToDisplay(item.imageURL);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  const startRoadtripClickHandler = () => {
    if (currentLocation == null) {
      return; // maybe should hide the button until it's not null
    }
    setModalVisible(true);
  };

  const endRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
    updateRoadtrip();
    setCurrentRoadTripData(null);
    setRoadtripName("");
  };

  const cancelRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
    deleteAllUsersRoadtrips();
    setCurrentRoadTripData(null);
    setRoadtripName("");
  };

  const cancelCreateHandler = () => {
    setModalVisible(false);
  };

  // get all users in the database
  async function getUsers() {
    await axios
      .get(`${REACT_APP_BASE_URL}/users/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const createHandler = () => {
    console.log(`roadtrip name: ${roadtripName}`);
    const roadtrip = {
      name: roadtripName,
      startLocation: currentLocation.name,
      startDate: new Date().toDateString(),
    };
    console.log(roadtrip.startLocation);
    // should add check to see if these fields are valid here and present alert if not
    axios
      .post(`${REACT_APP_BASE_URL}/roadtrips/create-roadtrip`, roadtrip)
      .then((response) => {
        setCurrentRoadTripData(response.data);
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
    setModalVisible(false);
    setButtonIsStartRoadtrip(false);
  };

  const deleteRoadtrip = async (username, tripId) => {
    await axios
      .patch(
        `${REACT_APP_BASE_URL}/users/delete-user-roadtrip/${username}`,
        { roadtripId: tripId, }
      )
      .then((response) => {
        console.log(response);
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

  const deleteAllUsersRoadtrips = async () => {
    const curRoadtripId = currentRoadTripData.createdReview._id; 
    for (const user in users) {
      const roadtrips = user.roadtrips; 
      const curUsername = user.spotifyUsername; 
      for (const roadtrip in roadtrips) {
        if (roadtrip == curRoadtripId) {
          await deleteRoadtrip(curUsername, curRoadtripId); 
        }
      }
    }
  }

  // const deleteRoadtrip = () => {
  //   axios
  //     .delete(
  //       `${REACT_APP_BASE_URL}/roadtrips/delete-roadtrip/${currentRoadTripData.createdReview._id}`
  //     )
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log("Error", error.message);
  //       }
  //       console.log(error.config);
  //     });
  // };

  const updateRoadtrip = () => {
    const endDetails = {
      destination: currentLocation.name,
      endDate: new Date().toDateString(),
    };
    axios
      .patch(
        `${REACT_APP_BASE_URL}/roadtrips/update-roadtrip/${currentRoadTripData.createdReview._id}`,
        endDetails
      )
      .then((response) => {
        console.log(response);
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

  const updateUserTrips = () => {
    if (currentRoadTripData) {
      const roadtripDetails = {
        roadtripId: currentRoadTripData.createdReview._id,
      };
      axios
        .patch(
          `${REACT_APP_BASE_URL}/users/update-user-roadtrip/${currentUsername}`,
          roadtripDetails
        )
        .then((response) => {
          console.log(response);
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
    }
  };

  // map size parameters
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = 0.0421;
  /**
   * updates the current location of the user
   * @param {Location.LocationObject} newLocation the new location
   */
  const updateLocationHandler = (newLocation, regionName) => {
    setCurrentLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      regionName: regionName,
      name: regionName[0]["city"] + ", " + regionName[0]["region"],
    });
  };

  const updateParentSongHandler = (newSong) => {
    setCurrentSong(newSong);
  };

  async function getUsername() {
    const accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response) {
      const responseJson = await response.json();
      setCurrentUsername(responseJson.id);
    } else {
      console.log("getUsername request returned no response");
    }
  }

  useEffect(() => {
    (async () => {
      await getUsername();
    })();
  }, []);

  useEffect(() => {
    updateUserTrips();
  }, [currentRoadTripData]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <HomeMap
        updateLocationHandler={updateLocationHandler}
        currentLocation={currentLocation}
        currentRoadTripData={currentRoadTripData}
        buttonIsStartRoadtrip={buttonIsStartRoadtrip}
        currentSong={currentSong}
        updateParentSongHandler={updateParentSongHandler}
        createImageViewer={createImageViewer}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={imageViewerVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setImageViewerVisible(false);
        }}
      >
        <ImageViewer
          closeImageViewer={closeImageViewer}
          imageURL={imageToDisplay}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView style={styles.centeredView}>
          <View style={styles.modalView}>
            <SafeAreaView>
              <Text style={styles.modalText}>Roadtrip Name</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(name) => setRoadtripName(name)}
              />
            </SafeAreaView>
            <View style={[styles.formButtonContainer]}>
              <Pressable
                style={[styles.cancelButton]}
                onPress={cancelCreateHandler}
              >
                <Text style={styles.blackBoldTextStyle}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.createButton]} onPress={createHandler}>
                <Text style={styles.whiteBoldTextStyle}>Create</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {buttonIsStartRoadtrip ? (
        <Pressable
          style={styles.startButton}
          onPress={startRoadtripClickHandler}
        >
          <FontAwesome name="play-circle" size={50} color="black" />
        </Pressable>
      ) : null}
      {!buttonIsStartRoadtrip ? (
        <View style={styles.roadtripHeader}>
          <View style={styles.songHeader}>
            {currentSong.imageURL ? (
              <Image
                style={styles.songImage}
                source={{ uri: currentSong.imageURL }}
              />
            ) : null}
            <View style={styles.songTexts}>
              <Text numberOfLines={1} style={styles.songTitle}>
                {currentSong.title}
              </Text>
              {currentSong.artist ? (
                <Text numberOfLines={1} style={styles.songArtist}>
                  {currentSong.artist}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.roadtripButtonContainer}>
            <Pressable
              style={styles.cancelRoadtripButton}
              onPress={cancelRoadtripClickHandler}
            >
              <MaterialIcons name="cancel" size={50} color="red" />
            </Pressable>
            <Pressable onPress={endRoadtripClickHandler}>
              <FontAwesome name="stop-circle" size={50} color="black" />
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
