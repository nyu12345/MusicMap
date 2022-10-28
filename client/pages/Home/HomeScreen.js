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
// import Geolocation from 'react-native-geolocation-service';
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { HomeMap } from "./HomeMap";

export function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [roadtripName, setRoadtripName] = useState("");
  const [roadtripStartLocation, setRoadtripStartLocation] = useState("");
  const [roadtripDestination, setRoadTripDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [buttonIsStartRoadtrip, setButtonIsStartRoadtrip] = useState(true);
  const [currentRoadTripData, setCurrentRoadTripData] = useState({});
  const START_ROADTRIP_BUTTON_TEXT = "Start Roadtrip Session";
  const CANCEL_ROADTRIP_BUTTON_TEXT = "Cancel Roadtrip Session";
  const END_ROADTRIP_BUTTON_TEXT = "End Roadtrip Session";

  const startRoadtripClickHandler = () => {
    setModalVisible(true);
  };

  const endRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
  };

  const cancelRoadtripClickHandler = () => {
    setButtonIsStartRoadtrip(true);
    deleteRoadtrip();
    setModalVisible(false);
  };

  const cancelCreateHandler = () => {
    setModalVisible(false);
  };

  const createHandler = () => {
    console.log(
      `name: ${roadtripName}, start: ${roadtripStartLocation}, end: ${roadtripDestination}`
    );
    const roadtrip = {
      name: roadtripName,
      startLocation: roadtripStartLocation,
      destination: roadtripDestination,
      startDate: startDate,
      endDate: endDate,
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <HomeMap></HomeMap>
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
              <Text style={styles.modalText}>Start Location</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(startLocation) =>
                  setRoadtripStartLocation(startLocation)
                }
              />
              <Text style={styles.modalText}>Destination</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(destination) =>
                  setRoadTripDestination(destination)
                }
              />
              <Text style={styles.modalText}>Start Date</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(startDate) => setStartDate(startDate)}
              />
              <Text style={styles.modalText}>End Date</Text>
              <TextInput
                style={styles.modalTextInput}
                onChangeText={(endDate) => setEndDate(endDate)}
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
