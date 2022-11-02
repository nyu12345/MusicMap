import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpoConstants from 'expo-constants'; 
import { StatisticsScreen } from './StatisticsScreen';
import { MapScreen } from './MapScreen'; 
import { PastTripsList } from 'musicmap/pages/PastTrips/PastTripsList'; 
import { Text, View, StyleSheet, Image } from 'react-native';
//import * as AuthSession from 'expo-auth-session';

const Tab = createMaterialTopTabNavigator();

// testing purposes, can remove
// console.log(AuthSession); 
// // used the uri returned from AuthSession.getRedirectUrl()
// const url = AuthSession.makeRedirectUri(); 
// console.log('below is url'); 
// console.log(url); 

export function PastTripsScreen() {
    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight}} >
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Statistics" component={StatisticsScreen} />
                {/* Bottom sheet goes here */}
        </Tab.Navigator>
    );
}