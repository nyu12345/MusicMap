import { Text, View, StyleSheet, Image } from 'react-native';
import React, { useCallback, useState, useMemo, useRef } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import lazyfair from 'musicmap/assets/lazyfair.jpg'; 
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { REACT_APP_BASE_URL } from '@env'; 

export function MapScreen() {
    // get roadtrip data from API
    const [roadtrips, setRoadtrips] = useState([]); 
    const base_url = `${REACT_APP_BASE_URL}/users/`; 

    axios.get(`${REACT_APP_BASE_URL}/roadtrips/`).then((response) => {
        console.log("Tried to get data");
        console.log(response.data);
        setStatistics(response.data);
    });

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

    // callbacks
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
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
    // renderItem = (data) => {
    //     return (
    //         <TouchableOpacity style={styles.list}>
    //             <Text style={styles.lightText}>{data.item.name}</Text>
    //             <Text style={styles.lightText}>{data.item.startLocatoin}</Text>
    //             <Text style={styles.lightText}>{data.item.destination}</Text>
    //             <Text style={styles.lightText}>{data.item.startDate}</Text>
    //             <Text style={styles.lightText}>{data.item.endDate}</Text></TouchableOpacity>
    //     )
    // }

    // return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         {
    //             roadtrips.length == 0 ? <Text></Text> :
    //             roadtrips.map((roadtrip) => (
    //                 <Text>{roadtrip.name} started at {roadtrip.startLocation}</Text>
    //             )
    //             )
    //         }
    //     </View>
    // );

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
                            source={require('musicmap/assets/lazyfair.jpg')} />
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