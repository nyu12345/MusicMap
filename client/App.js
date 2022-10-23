import * as React from 'react';
import { Text, View } from 'react-native';
import { HomeScreen } from './pages/Home';
import { PastTripsScreen } from './pages/PastTrips/PastTripsScreen';
import { MemoriesScreen } from './pages/Memories';
import { ProfileScreen } from './pages/Profile';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else if (route.name === 'Past Trips') {
              iconName = focused ? 'ios-list-circle' : 'ios-list-circle-outline';
            } else if (route.name === 'Memories') {
              iconName = focused ? 'eye-sharp' : 'eye-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'ios-person-circle-sharp' : 'ios-person-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Tab.Screen options={{ headerShown: false }} name="Past Trips" component={PastTripsScreen} />
        <Tab.Screen options={{ headerShown: false }} name="Memories" component={MemoriesScreen} />
        <Tab.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 