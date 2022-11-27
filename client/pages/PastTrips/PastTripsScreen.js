import React, { useEffect, useState, useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExpoConstants from "expo-constants";
import { StatisticsScreen } from "musicmap/pages/PastTrips/Statistics/StatisticsScreen";
import { MapScreen } from "musicmap/pages/PastTrips/PastTripMap/MapScreen";
import { PastTripsList } from "musicmap/pages/PastTrips/PastTripMap/PastTripsList";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  Pressable,
} from "react-native";

const Tab = createMaterialTopTabNavigator();

export function PastTripsScreen() {
  return (
    <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight }}>
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
}
