import { Text, View, StyleSheet, Image, TouchableOpacity, TurboModuleRegistry } from 'react-native';
import React, { useCallback, useState, useMemo, useRef } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import lazyfair from 'musicmap/assets/lazyfair.jpg'; 
import PastTrip from 'musicmap/pages/PastTrips/PastTrip';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { REACT_APP_BASE_URL } from '@env'; 

export function MapScreen() {
    const base_url = `${REACT_APP_BASE_URL}/users/`; 
    const [roadtrips, setRoadtrips] = useState([]); 
    const [searchInput, setSearchInput] = useState(""); 

    // get roadtrip data from API
    if (roadtrips.length == 0) {
        axios.get(`${REACT_APP_BASE_URL}/roadtrips/`).then((response) => {
            console.log("Tried to get data");
            console.log(response.data);
            setRoadtrips(response.data);
        });
    } else {
        console.log('printing'); 
    }

    const bottomSheetRef = useRef(null); 

    // Points for the bottom sheet to snap to, sorted from bottom to top
    const snapPoints = useMemo(() => ['13%', '50%', '95%'], []);

    // callbacks
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleRefresh = useCallback(() => {
        setRoadtrips([]); 
        console.log("handleRefresh");
    }, []);

    // handle search
    const filter = (roadtrips) => {
        console.log(searchInput); 
        if (searchInput == "") {
            return roadtrips; 
        }
        return roadtrips.filter(function({ name, startLocation, destination }) {
            let input = searchInput.toLowerCase();
            const nameArr = name.split(' '); 
            const startLocationArr = startLocation.split(' '); 
            const destinationArr = destination.split(' '); 
            for ( const roadtripName of nameArr ) {
                if (roadtripName.toLowerCase().indexOf(input) == 0) {
                    return true; 
                }
            }
            for ( const location of startLocationArr ) {
                if (location.toLowerCase().indexOf(input) == 0) {
                    return true; 
                }
            }
            for ( const destination of destinationArr) {
                if (destination.toLowerCase().indexOf(input) == 0) {
                    return true; 
                }
            }
            //return lcName.includes(input) || lcStartLocation.includes(input) || lcDestination.includes(input); 
        }); 
    }; 

    // render
    const renderItem = ({ item }) => (
        <PastTrip 
            name={item.name} 
            startLocation={item.startLocation}
            destination={item.destination}
            startDate={item.startDate}
            endDate={item.endDate}
        />
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
                    onChangeText={setSearchInput} // look into for setting states
                    value={searchInput}
                    style={styles.textInput}
                />
                <BottomSheetFlatList
                    data={filter(roadtrips, searchInput)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    refreshing={roadtrips.length == 0}
                    onRefresh={handleRefresh}
                    style={{ backgroundColor: "white" }}
                    contentContainerStyle={{ backgroundColor: "white" }}
                />
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
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
        color: "black",
        textAlign: "left",
    },
}); 