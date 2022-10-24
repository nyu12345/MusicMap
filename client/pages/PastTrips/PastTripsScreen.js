import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpoConstants from 'expo-constants'; 
import { StatisticsScreen } from './StatisticsScreen';
import { MapScreen } from './MapScreen'; 

const Tab = createMaterialTopTabNavigator();

export function PastTripsScreen() {
    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight}} >
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Statistics" component={StatisticsScreen} />
        </Tab.Navigator>
    );
}