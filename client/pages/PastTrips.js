import { Text, View, Tabs } from 'react-native';
import * as React from 'react';
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

function MapScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Map!</Text>
      </View>
    );
}

function StatisticsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Statistics!</Text>
      </View>
    );
}