import { Pressable, StyleSheet, Image, Text, View, Button, Dimensions } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAsync } from "react-async"
import { Audio } from 'expo-av';
import ScrollingBackground from 'react-native-scrolling-images';

const playingAudio = new Audio.Sound();

export function VideoScreen({ currentRoadtrip }) {
    const [count, setCount] = useState(0);
    const [sound, setSound] = React.useState();

    let images = [];
    if(currentRoadtrip != null && 'images' in currentRoadtrip) {
        // console.log(currentRoadtrip.images.length)
        for (image of currentRoadtrip.images) {
            images.push({"uri": image.imageURL});
        }
    }

    let songURL = "";
    if(currentRoadtrip != null && 'songURL' in currentRoadtrip) {
        console.log("Song URL: " + currentRoadtrip['songURL']);
        songURL = currentRoadtrip['songURL'];
    }
    // console.log(images);

    useEffect(() => {
        const id = setInterval(() => setCount((oldCount) => oldCount + 1), 3000);

        return () => {
            clearInterval(id);
        };
    }, []);

    function validSongURL() {
        if(songURL=="" || songURL ==null || songURL == undefined){
            return false;
        }
        return true;
    }

    async function playSound() {
        if(!validSongURL()){
            console.log("URL not found");
            return;
        }

        console.log('Loading Sound');
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
        });
        // const { sound } = await Audio.Sound.createAsync(require('musicmap/assets/song.mp3'));
        const { sound } = await Audio.Sound.createAsync({
            uri: songURL
            // uri: "https://p.scdn.co/mp3-preview/9987afad70a92173d06c04b1080e273f7362f39f?cid=c860b7dae1614405b0a16ec496254c72"
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
    if (images.length == 0)
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>No images found</Text>
                {validSongURL() ? <Button title="Play Music" onPress={playSound} /> : <Text> No song found</Text>}
            </View>
        )
    // images = [{"uri": "file:///var/mobile/Containers/Data/Application/3BC125A9-7B97-4FD2-9313-44602837D197/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmusicmap-cd653aae-17b3-45d9-816b-32dbe7bbae9c/ImagePicker/D417CD48-65EA-4D02-980D-EFEF48D26EFC.jpg"}, 
    // {"uri": "file:///var/mobile/Containers/Data/Application/3BC125A9-7B97-4FD2-9313-44602837D197/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmusicmap-cd653aae-17b3-45d9-816b-32dbe7bbae9c/ImagePicker/A365A701-A71F-447C-9150-2BB3AEA63896.jpg"}]
    // console.log(images[count % images.length]);
    return (
        <View>
             {validSongURL() ? <Button title="Play Music" onPress={playSound} /> : <Text> No song found</Text>}
            <View style={styles.container}>
            {/* <Image source={{"uri": "file:///var/mobile/Containers/Data/Application/3BC125A9-7B97-4FD2-9313-44602837D197/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmusicmap-cd653aae-17b3-45d9-816b-32dbe7bbae9c/ImagePicker/D417CD48-65EA-4D02-980D-EFEF48D26EFC.jpg"}} style={styles.image} /> */}
                <Image source={images[count % images.length]} style={styles.image} resizeMode='contain' />
            </View>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        width: Dimensions.get('window').width * 0.8,
        maxHeight: Dimensions.get('window').height * 0.5,
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
    scrollingBackground: {
        backgroundColor: "#0B7483"
    },
    image: {
        // borderRadius: 10,
        // maxWidth: Dimensions.get('window').width * 0.7,
        // aspectRatio: 1,
        // height: Dimensions.get('window').height*0.75,
        // width: "100%",

        // height: "20%",
    //     borderRadius: 10,
    width: "85%",
    height: "100%",
    },
});