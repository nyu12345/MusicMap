import { Text, TextInput, SafeAreaView, View, StyleSheet, Pressable, Alert, Modal } from 'react-native';
import MapView from 'react-native-maps';
import React, { useEffect, useState } from "react";

export function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [startRoadtripButtonVisible, setStartRoadtripButtonVisible] = useState(true);
    const [roadtripName, setRoadtripName] = useState('');
    const [roadtripStartLocation, setRoadtripStartLocation] = useState('');
    const [roadtripDestination, setRoadTripDestination] = useState('');

    // useEffect(() => {
    //     setModalVisible(!modalVisible); // This will always use latest value of count
    // }, [modalVisible]);

    const startRoadtripClickHandler = () => {
        setModalVisible(true);
        setStartRoadtripButtonVisible(false);
    }
    const modalConfirmClickHandler = () => {
        console.log(`name: ${roadtripName}, start: ${roadtripStartLocation}, end: ${roadtripDestination}`);
        // TODO: MAKE POST REQUEST HERE
        setModalVisible(false);
        // this shits async or smth i hate react
        console.log(`modal visible: ${modalVisible}`);
        setStartRoadtripButtonVisible(false);
    }

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
            >
                <View style={styles.centeredView}>
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
                        </SafeAreaView>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={modalConfirmClickHandler}
                        >
                            <Text style={styles.whiteBoldTextrStyle}>Confirm</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
            <Pressable
                style={styles.button}
                visible={startRoadtripButtonVisible}
                onPress={startRoadtripClickHandler}
            >
                <Text title='Start Roadtrip'
                    style={styles.text}>
                    Start Roadtrip Session
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
        justifyContent: "center",
        alignItems: "center",
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
