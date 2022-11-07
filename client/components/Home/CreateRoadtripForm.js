import React, { useState, useEffect } from "react";
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

export default function CreateRoadTripeForm(props) {
    return (
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
    )
}