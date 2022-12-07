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
import React, { useState, useEffect, useRef } from "react";
import styles from "./HomeStyles";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { HomeMap } from "./HomeMap";
import { ImageViewer } from "musicmap/pages/Home/ImageViewer";
import * as Location from "expo-location";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";
import { AddFriendRoadtripBottomSheet } from "musicmap/pages/Home/AddFriendRoadtripBottomSheet";

export function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageToDisplay, setImageToDisplay] = useState("");
  const [roadtripName, setRoadtripName] = useState("");
  const [roadtripId, setRoadtripId] = useState(null);
  const [buttonIsStartRoadtrip, setButtonIsStartRoadtrip] = useState(true);
  const [currentRoadTripData, setCurrentRoadTripData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentSong, setCurrentSong] = useState({ title: "No song", spotifyId: null });
  const [currentUsername, setCurrentUsername] = useState(null);
  const bottomSheetModalRef = useRef(null);

  /**
   * Sets Image picker UI to be visible after road trip session starts
   */
  const createImageViewer = (item) => {
    setImageViewerVisible(true);
    setImageToDisplay(item.imageURL);
  };

  /**
   * Sets image viewer to be invisible after road trip session ends
   */
  const closeImageViewer = () => {
    setImageViewerVisible(false);
  }

  /**
   * Called by the start roadtrip button and sets the roadtrip creation modal to 
   * visible if the currentlocation is found
   * @returns 
   */
  const startRoadtripClickHandler = () => {
    if (currentLocation == null) {
      return;
    }
    setModalVisible(true);
  };

  /**
   * Handler function called after end roadtrip button is clicked. 
   * Updates the roadtrip in the database and resets UI and roadtrip data
   */
  const endRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
    updateRoadtrip();
    setCurrentRoadTripData(null);
    setRoadtripName("");
  };

  /**
   * Handler function called after cancel roadtrip button is clicked. 
   * deletes the roadtrip in the database and resets UI and roadtrip data
   */
  const cancelRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
    deleteRoadtrip();
    setCurrentRoadTripData(null);
    setRoadtripName("");
  };

  /**
   * In the roadtrip creation modal, if cancel is called, this function will hide the modal again
   */
  const cancelCreateHandler = () => {
    setModalVisible(false);
  };

  /**
   * Handles the creation of a roadtrip after create button is clicked
   * Posts the new roadtrip to the roadtrips collection.
   */
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
        setRoadtripId(response.data.createdReview._id);
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

  /**
   * Handles the deletion of a roadtrip after delete button is clicked
   * deletes the new roadtrip from the roadtrips collection.
   */
  const deleteRoadtrip = () => {
    axios
      .delete(
        `${REACT_APP_BASE_URL}/roadtrips/delete-roadtrip/${currentRoadTripData.createdReview._id}`
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

  /**
   * Handles the updating of a roadtrip after end button is clicked
   * updates the new roadtrip from the roadtrips collection to include a destination and end time
   */
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

  /**
   * Handler to update the user's roadtrip list entry in the users collection
   */
  const updateUserTrips = () => {
    if (currentRoadTripData) {
      const roadtripDetails = {
        roadtripId: currentRoadTripData.createdReview._id
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

  /**
   * Handler function that will update the state of currentSong.
   * Passes currentSong state updating to the child component HomeMap
   * @param {Object} newSong 
   */
  const updateParentSongHandler = (newSong) => {
    setCurrentSong(newSong);
  }

  const addFriendtoRoadtrip = () => {

  }

  const openAddFriendModal = () => {
    bottomSheetModalRef.current.present();
  };


  /**
   * API call to get the current spotify user's username
   */
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

  /**
   * Gets the username at the beginning of a render once.
   */
  useEffect(() => {
    (async () => {
      await getUsername();
    })();
  }, []);

  /**
   * Hook tied to currentRoadTripData state. When currentRoadTripData is loaded, the user roadtrips will automatically update in the users collection
   */
  useEffect(() => {
    updateUserTrips();
  }, [currentRoadTripData])

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
        style={styles.homeMap}
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
        <ImageViewer closeImageViewer={closeImageViewer} imageURL={imageToDisplay} />
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
      {!buttonIsStartRoadtrip ? (
        <Pressable style={styles.addFriendsButton} onPress={openAddFriendModal}>
          <MaterialIcons name="person-add-alt-1" size={28} color="#696969" />
        </Pressable>
      ) : null}
      <AddFriendRoadtripBottomSheet style={styles.bottomSheetRoadtripFriends} roadtripId={roadtripId} bottomSheetModalRef={bottomSheetModalRef} />
      {buttonIsStartRoadtrip ? (
        <Pressable
          style={styles.startButton}
          onPress={startRoadtripClickHandler}
        >
          <FontAwesome name="play-circle" size={50} color="black" />
        </Pressable>
      ) : null}
      {!buttonIsStartRoadtrip ? (
        <View
          style={styles.roadtripHeader}
        >
          <View style={styles.songHeader}>
            {currentSong.imageURL ? (
              <Image
                style={styles.songImage}
                source={{ uri: currentSong.imageURL }}
              />) : null}
            <View style={styles.songTexts}>
              <Text numberOfLines={1} style={styles.songTitle}>{currentSong.title}</Text>
              {currentSong.artist ? <Text numberOfLines={1} style={styles.songArtist}>{currentSong.artist}</Text> : null}
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
