import { Pressable, StyleSheet, Image, Text, View, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAsync } from "react-async"
import { Video, AVPlaybackStatus } from 'expo-av';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';

export function VideoScreen({ currentRoadtrip }) {
    const video = React.useRef(null);
    const [videoLink, setVideoLink] = useState("");
    const [status, setStatus] = useState({});
    if(currentRoadtrip == null)
        return <Text> Error </Text>;
    const images = currentRoadtrip["images"];
    if(images.length == 0)
        return <Text> Error: No images found </Text>;
    
    useEffect(() => {
        async function fetchVideo() {
            try {
                // const ffmpeg = createFFmpeg({
                //     log: true,

                // });
                // await ffmpeg.load();
                setVideoLink('https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4');
            } catch (error) {
                console.log("Error when creating collage");
            }
        }
        fetchVideo();
    });
    // console.log("current trip:");
    // console.log(currentRoadtrip);
    if (videoLink == "")
        return <View>
            <Text>
                Loading Video
            </Text>
        </View>;
    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: videoLink,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.button}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View>
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
