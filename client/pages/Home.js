import { Text, TextInput, SafeAreaView, ScrollView, View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
// import { HStack, VStack } from 'react-native-flex-layout';
import React, { useState } from "react";
import MapView from 'react-native-maps';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

export function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [startRoadtripButtonText, setStartRoadtripButtonText] = useState('Start Roadtrip Session');
    const [roadtripName, setRoadtripName] = useState('');
    const [roadtripStartLocation, setRoadtripStartLocation] = useState('');
    const [roadtripDestination, setRoadTripDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const startRoadtripClickHandler = () => {
        setModalVisible(true);
    }

    const modalConfirmClickHandler = () => {
        console.log(`name: ${roadtripName}, start: ${roadtripStartLocation}, end: ${roadtripDestination}`);
        handleSubmit();
        setModalVisible(false);
        setStartRoadtripButtonText('End Roadtrip Session');
    }

    const handleSubmit = () => {
        const roadtrip = {
            name: roadtripName,
            startLocation: roadtripStartLocation,
            destination: roadtripDestination,
            startDate: startDate,
            endDate: endDate,
        };
        // should add check to see if these fields are valid here and present alert if not
        axios.post(`${REACT_APP_BASE_URL}/roadtrips/create-roadtrip`, roadtrip).then((response) => {
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
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
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
                        {/* <Vstack> */}
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={modalConfirmClickHandler}
                            >
                                <Text style={styles.whiteBoldTextStyle}>Confirm</Text>
                            </Pressable>
                            {/* <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={modalConfirmClickHandler}
                            >
                                <Text style={styles.whiteBoldTextStyle}>Cancel</Text>
                            </Pressable> */}
                        {/* </Vstack> */}
                    </View>
                </ScrollView>
            </Modal>
            <Pressable
                style={styles.button}
                onPress={startRoadtripClickHandler}
            >
                <Text title='Start Roadtrip'
                    style={styles.text}>
                    {startRoadtripButtonText}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 30,
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
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    whiteBoldTextStyle: {
        color: "white",
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
