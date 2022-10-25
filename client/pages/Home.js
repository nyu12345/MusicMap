import { Text, TextInput, SafeAreaView, ScrollView, View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import React, { useState } from "react";
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

export function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [roadtripName, setRoadtripName] = useState('');
    const [roadtripStartLocation, setRoadtripStartLocation] = useState('');
    const [roadtripDestination, setRoadTripDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [buttonIsStartRoadtrip, setButtonIsStartRoadtrip] = useState(true);
    const START_ROADTRIP_BUTTON_TEXT = 'Start Roadtrip Session';
    const CANCEL_ROADTRIP_BUTTON_TEXT = 'Cancel Roadtrip Session';
    const END_ROADTRIP_BUTTON_TEXT = 'End Roadtrip Session';

    const location = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const startRoadtripClickHandler = () => {
        setModalVisible(true);
    }

    const endRoadtripClickHandler = () => {
        setButtonIsStartRoadtrip(true);
        // CALL UPDATE HERE
    }

    const cancelRoadtripClickHandler = () => {
        setButtonIsStartRoadtrip(true);
        // CALL DELETE HERE
        // cancelHandler();
    }

    const createHandler = async () => {
        console.log(`name: ${roadtripName}, start: ${roadtripStartLocation}, end: ${roadtripDestination}`);
        const roadtrip = {
            name: roadtripName,
            startLocation: roadtripStartLocation,
            destination: roadtripDestination,
            startDate: startDate,
            endDate: endDate,
        };
        // should add check to see if these fields are valid here and present alert if not
        let currentRoadTripResponse = await axios.post(`${REACT_APP_BASE_URL}/roadtrips/create-roadtrip`, roadtrip).then((response) => {
            console.log(response);
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

        setModalVisible(false);
        setButtonIsStartRoadtrip(false);

        console.log("poo" + currentRoadTripResponse.data);
    };

    const cancelHandler = () => {
        // should add check to see if these fields are valid here and present alert if not
        axios.delete(`${REACT_APP_BASE_URL}/roadtrips/delete-roadtrip/`).then((response) => {
            console.log(response);
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
        setModalVisible(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapView
                style={styles.map}
                initialRegion={location}
                showsUserLocation={true}
            >
            {/* <Marker coordinate={location}
              pinColor="red"
            />     */}
            </MapView>
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
                                onChangeText={name => setRoadtripName(name)}
                            />
                            <Text style={styles.modalText}>Start Location</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                onChangeText={startLocation => setRoadtripStartLocation(startLocation)}
                            />
                            <Text style={styles.modalText}>Destination</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                onChangeText={destination => setRoadTripDestination(destination)}
                            />
                            <Text style={styles.modalText}>Start Date</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                onChangeText={startDate => setStartDate(startDate)}
                            />
                            <Text style={styles.modalText}>End Date</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                onChangeText={endDate => setEndDate(endDate)}
                            />
                        </SafeAreaView>
                        <View style={[styles.formButtonContainer]}>
                            <Pressable
                                style={[styles.cancelButton]}
                                onPress={cancelHandler}
                            >
                                <Text style={styles.blackBoldTextStyle}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.createButton]}
                                onPress={createHandler}
                            >
                                <Text style={styles.whiteBoldTextStyle}>Create</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            {
                buttonIsStartRoadtrip ?
            <Pressable
                style={styles.startButton}
                onPress={startRoadtripClickHandler}
            >
                <Text title='Start Roadtrip'
                    style={styles.text}>
                    {START_ROADTRIP_BUTTON_TEXT}
                </Text>
            </Pressable> : null
            }
            {
                !buttonIsStartRoadtrip ?
            <Pressable
                style={styles.startButton}
                onPress={endRoadtripClickHandler}
            >
                <Text title='End Roadtrip'
                    style={styles.text}>
                    {END_ROADTRIP_BUTTON_TEXT}
                </Text>
            </Pressable> : null
            }
            {
                !buttonIsStartRoadtrip ?
            <Pressable
                style={styles.cancelRoadtripButton}
                onPress={cancelRoadtripClickHandler}
            >
                <Text title='Cancel Roadtrip'
                    style={styles.text}>
                    {CANCEL_ROADTRIP_BUTTON_TEXT}
                </Text>
            </Pressable> : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    startButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 30,
    },
    cancelRoadtripButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 80,
    },
    createButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 4,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        width: 100,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingVertical: 12,
        borderRadius: 4,
        borderColor: 'black',
        borderWidth: 1,
        elevation: 3,
        backgroundColor: 'white',
        width: 100,
    },
    formButtonContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    modalText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        position: 'centered',
        color: 'black',
    },
    centeredView: {
        flex: 1,
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 75,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    whiteBoldTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    blackBoldTextStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalTextInput: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
