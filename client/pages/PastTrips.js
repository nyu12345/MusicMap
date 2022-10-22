import { Text, View, StyleSheet, Image, Button } from 'react-native';
//import * as React from 'react';
import React, { useCallback, useMemo, useRef } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import lazyfair from './../assets/lazyfair.jpg'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

const Tab = createMaterialTopTabNavigator();

export function PastTripsScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Statistics" component={StatisticsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
    contentContainer: {
        backgroundColor: "white",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

function MapScreen() {
    const bottomSheetRef = useRef(null); 

    // Points for the bottom sheet to snap to, sorted from bottom to top
    const snapPoints = useMemo(() => ['25%', '50%', '95%'], []);

    // variables
    const data = useMemo(
        () =>
        Array(50)
            .fill(0)
            .map((_, index) => `index-${index}`),
        []
    );

    // callbacks
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    // render
    const renderItem = useCallback(
        ({ item }) => (
        <View style={styles.itemContainer}>
            <Text>{item}</Text>
        </View>
        ),
        []
    );

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
            >
                <Marker
                    coordinate={{ latitude: 37.7825259, longitude: -122.4351431 }}
                    title={'San Francisco'}>
                    <Callout>
                        <Image style={{ alignSelf: 'center', width: 50, height: 50 }}
                            source={require('./../assets/lazyfair.jpg')} />
                        <Text style={{textAlign: 'center'}}>Sour Patch Kids</Text>
                        <Text style={{textAlign: 'center'}}>Bryce Vine</Text>
                    </Callout>
                </Marker>
            </MapView>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
            >
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(i) => i}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                />
            </BottomSheet>
        </View>
    );
}

function StatisticsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>There are graphs and Statistics here</Text>
        </View>
    );
}