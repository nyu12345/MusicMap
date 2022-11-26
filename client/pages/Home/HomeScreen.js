import {
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import React, { useState } from "react";
import styles from "./HomeStyles";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { HomeMap } from "./HomeMap";
import * as Location from "expo-location";

export function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [roadtripName, setRoadtripName] = useState("");
  const [buttonIsStartRoadtrip, setButtonIsStartRoadtrip] = useState(true);
  const [currentRoadTripData, setCurrentRoadTripData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const START_ROADTRIP_BUTTON_TEXT = "Start Roadtrip Session";
  const CANCEL_ROADTRIP_BUTTON_TEXT = "Cancel Roadtrip Session";
  const END_ROADTRIP_BUTTON_TEXT = "End Roadtrip Session";

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
    deleteRoadtrip();
    setModalVisible(false);
    setCurrentRoadTripData(null);
    setRoadtripName("");
  };

  const cancelCreateHandler = () => {
    setModalVisible(false);
  };

  const createHandler = () => {
    console.log(`name: ${roadtripName}`);
    const roadtrip = {
      name: roadtripName,
      startLocation: currentLocation.name,
      startDate: new Date().toDateString(),
    };
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

  // map size parameters
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = 0.0421;
  /**
   * update's the current location of the user
   * @param {Location.LocationObject} newLocation the new location
   */
  const updateLocationHandler = (newLocation, regionName) => {
    setCurrentLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      name: regionName[0]["city"] + ", " + regionName[0]["region"],
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <HomeMap
        updateLocationHandler={updateLocationHandler}
        currentLocation={currentLocation}
        currentRoadTripData={currentRoadTripData}
      />
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
          <Text title="Start Roadtrip" style={styles.text}>
            {START_ROADTRIP_BUTTON_TEXT}
          </Text>
        </Pressable>
      ) : null}
      {!buttonIsStartRoadtrip ? (
        <Pressable style={styles.startButton} onPress={endRoadtripClickHandler}>
          <Text title="End Roadtrip" style={styles.text}>
            {END_ROADTRIP_BUTTON_TEXT}
          </Text>
        </Pressable>
      ) : null}
      {!buttonIsStartRoadtrip ? (
        <Pressable
          style={styles.cancelRoadtripButton}
          onPress={cancelRoadtripClickHandler}
        >
          <Text title="Cancel Roadtrip" style={styles.text}>
            {CANCEL_ROADTRIP_BUTTON_TEXT}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
