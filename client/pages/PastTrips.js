import { Text, View, StyleSheet, Image, Button } from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import lazyfair from './../assets/lazyfair.jpg'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import ExpoConstants from 'expo-constants'; 
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export function PastTripsScreen() {
    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight}} >
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Statistics" component={StatisticsScreen} />
        </Tab.Navigator>
    );
}

function MapScreen() {
    const bottomSheetRef = useRef(null); 

    // Points for the bottom sheet to snap to, sorted from bottom to top
    const snapPoints = useMemo(() => ['13%', '50%', '95%'], []);

    // variables
    const data = useMemo(
        () =>
        Array(50)
            .fill(0)
            .map((_, index) => `index-${index}`),
        []
    );

    // const data = {
    //     [
    //         name: 'the first roadtrip', 
    //         startLocation: 'San Francisco', 
    //         destination: 'Monterrey',
    //         startDate: '2020-01-01', 
    //         endDate: '2020-01-09', 
    //     ], 
    //     [
    //         name: 'the second roadtrip', 
    //         startLocation: 'San Francisco', 
    //         destination: 'Durham',
    //         startDate: '2020-03-01', 
    //         endDate: '2020-03-20', 
    //     ]
    // }

    //console.log(data)
    //console.log(typeof(data))

    // callbacks
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);
    const handleRefresh = useCallback(() => {
        console.log("handleRefresh");
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
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChange}
                keyboardBehavior="fillParent"
            >
                <BottomSheetTextInput
                    placeholder='Search by date, song, people, or location'
                    //onChangeText={setSearchInput} // look into for setting states
                    style={styles.textInput}
                />
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(i) => i}
                    renderItem={renderItem}
                    refreshing={false}
                    onRefresh={handleRefresh}
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

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: "#eee",
    },
    contentContainer: {
        backgroundColor: "white",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    textInput: {
        alignSelf: "stretch",
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "rgba(151, 151, 151, 0.25)",
        color: "white",
        textAlign: "left",
    },
});