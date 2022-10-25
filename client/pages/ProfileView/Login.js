import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import React, { useCallback, useState, useMemo, useRef, useContext } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'; 

export function LoginScreen() {
    const [user, setUser] = useState(''); 
    const [username, setUsername] = useState('');
  
    function registerUser() {
        axios.post(`${REACT_APP_BASE_URL}/users/`, {
          name: user,
          spotifyUsername: username,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    return (
      <View style={styles.container}>
        <TextInput styles = {styles.label} onChangeText={setUser} placeholder = 'Name: '/>
        <TextInput styles = {styles.label} onChangeText={setUsername} placeholder = 'Username:' />
        <Button styles = {styles.button} onPress = {registerUser} title = 'Submit'/>
    </View>
    );
  }

  const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
    backgroundColor: 'white',
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
  },
});