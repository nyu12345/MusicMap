import { Text, View, StyleSheet, Image } from 'react-native';
import * as React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import lazyfair from './../assets/lazyfair.jpg'; 
import BottomSheet from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const bottomSheet = () => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
  
    // Points for the bottom sheet to snap to, sorted from bottom to top
    const snapPoints = useMemo(() => ['25%', '50%'], []);
  
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);
  
    // renders
    return (
      <View style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheet>
      </View>
    );
  };

function MapScreen() {
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