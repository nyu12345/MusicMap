import React, { useEffect, useState, useRef } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExpoConstants from 'expo-constants';
import { ProfileScreen } from 'musicmap/pages/Profile/ProfileScreen';
import { FriendRequestsScreen } from 'musicmap/pages/Profile/FriendRequestsScreen';
import { SentScreen } from 'musicmap/pages/Profile/SentScreen';
import { Text, View, StyleSheet, Image, Animated, Pressable } from 'react-native';

const Tab = createMaterialTopTabNavigator();

/**
 * 
 * @returns a screen that has two tabs, one for the user profile, and one that
 * contains the sent and received friend requests screens
 */
export function ProfileHomeScreen(props) {
    const loginToParent = () => {
    props.loginToParent();
    }

    return (
        <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight }} >
            <Tab.Screen name="Your Profile"
            children={props => <ProfileScreen navigation={props.navigation} loginToParent={loginToParent} />}
             />
            <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
            {/* Bottom sheet goes here */}
        </Tab.Navigator>

    );
}