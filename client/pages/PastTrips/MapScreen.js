import { Text, View, StyleSheet, Image } from 'react-native';
import React, { useCallback, useState, useMemo, useRef } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import lazyfair from 'musicmap/assets/lazyfair.jpg'; 
import { PastTripsList } from 'musicmap/pages/PastTrips/PastTripsList';

export function MapScreen() {
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
                        <Text style={{ textAlign: 'center' }}>Sour Patch Kids</Text>
                        <Text style={{ textAlign: 'center' }}>Bryce Vine</Text>
                    </Callout>
                </Marker>
            </MapView>
            <PastTripsList/>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
}); 