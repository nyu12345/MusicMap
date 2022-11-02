import { Text, View, TextInput, Button, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import React, { useCallback, useState, useMemo, useRef, useContext } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env'; 

export function LoginScreen() {
  function openSpotifyLogin() {
    console.log("inside login"); 
    axios.get(`${REACT_APP_BASE_URL}/auth/spotify`).then(res => {
      console.log("redirected to Spotify"); 
    }).catch(error => console.log(error)); 
  }

  return (
    <SafeAreaView>
      <Pressable onPress={openSpotifyLogin}>
        <Text>Sign in with Spotify</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// export function LoginScreen() {
//     const [user, setUser] = useState(''); 
//     const [username, setUsername] = useState('');
  
//     function registerUser() {
//         axios.post(`${REACT_APP_BASE_URL}/users/`, {
//           name: user,
//           spotifyUsername: username,
//           friends: []
//         })
//         .then(function (response) {
//           console.log(response);
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//     }

//     return (
//       <View style={styles.container}>
//         <TextInput styles = {styles.label} onChangeText={setUser} placeholder = 'Name: '/>
//         <TextInput styles = {styles.label} onChangeText={setUsername} placeholder = 'Username:' />
//         <Button styles = {styles.button} onPress = {registerUser} title = 'Submit'/>
//     </View>
//     );
//   }

//   const styles = StyleSheet.create({
//   label: {
//     color: 'white',
//     margin: 20,
//     marginLeft: 0,
//     backgroundColor: 'white',
//   },
//   button: {
//     marginTop: 40,
//     color: 'white',
//     height: 40,
//     backgroundColor: '#ec5990',
//     borderRadius: 4,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 8,
//   },
// });