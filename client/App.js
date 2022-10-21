import * as React from 'react';
import { Text, View } from 'react-native';
import { HomeScreen } from './pages/Home';
import { PastTripsScreen } from './pages/PastTrips';
import { MemoriesScreen } from './pages/Memories';
import { ProfileScreen } from './pages/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Past Trips" component={PastTripsScreen} />
        <Tab.Screen name="Memories" component={MemoriesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
}