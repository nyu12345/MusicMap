import { Pressable, StyleSheet, Image, Text, View, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAsync } from "react-async"
import { Video, AVPlaybackStatus, Audio } from 'expo-av';

const playingAudio = new Audio.Sound();

export function VideoScreen({ currentRoadtrip }) {
    const [sound, setSound] = React.useState();

    async function playSound() {
        console.log('Loading Sound');
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
          });
        // const { sound } = await Audio.Sound.createAsync(require('musicmap/assets/song.mp3'));
        const { sound } = await Audio.Sound.createAsync({
            uri: "https://p.scdn.co/mp3-preview/9987afad70a92173d06c04b1080e273f7362f39f?cid=c860b7dae1614405b0a16ec496254c72"
        })
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
