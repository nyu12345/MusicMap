import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import React, { useCallback, useState, useMemo, useRef } from 'react';
import {LoginScreen} from './Login'
import { FriendsScreen } from './FriendsView';
import ExpoConstants from 'expo-constants'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export function ProfileScreen() {
    const [loginStatus, setLogin] = useState(false); 

    const handleCallback = (loginData) =>{
      setLogin(loginData);
    }

    return (
      <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight}} >
                <Tab.Screen name="Login" component={LoginScreen} />
                <Tab.Screen name="Friends" component={FriendsScreen} />
        </Tab.Navigator>
    );
  }

  const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0e101c',
  },
});