import React, { useEffect, useState, useRef } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpoConstants from 'expo-constants';
import { ProfileScreen } from 'musicmap/pages/Profile/ProfileScreen';
import { ReceivedScreen } from 'musicmap/pages/Profile/ReceivedScreen';
import { SentScreen } from 'musicmap/pages/Profile/SentScreen';
import { Text, View, StyleSheet, Image, Animated, Pressable } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export function ProfileHomeScreen(props) {
    const loginToParent = () => {
    props.loginToParent();
    }

    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight }} >
            <Tab.Screen name="Your Profile"
            children={props => <ProfileScreen navigation={props.navigation} loginToParent={loginToParent} />}
             />
            <Tab.Screen name="Received" component={ReceivedScreen} />
            <Tab.Screen name="Sent" component={SentScreen} />
            {/* Bottom sheet goes here */}
        </Tab.Navigator>

    );
}