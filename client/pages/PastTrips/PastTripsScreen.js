import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpoConstants from 'expo-constants'; 
import { StatisticsScreen } from './StatisticsScreen';
import { MapScreen } from './MapScreen'; 
import { PastTripsList } from 'musicmap/pages/PastTrips/PastTripsList'; 
import { Text, View, StyleSheet, Image } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export function PastTripsScreen() {
    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight}} >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Statistics" component={StatisticsScreen} />
        </Tab.Navigator>
    );
}