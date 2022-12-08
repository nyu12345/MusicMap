import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableHighlight,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { useState } from "react";
import { sendPushNotification } from "musicmap/util/Notifications"

export const FriendAddtoRoadtripCard = ({
    username,
    name,
    profilePic,
    roadtripId
}) => {

    const [addedState, setAddedState] = useState("Add Friend");
    async function addFriendtoRoadtrip() {
        console.log("Adding friend to roadtrip");
        console.log(username);
        const roadtripDetails = {
            roadtripId: roadtripId
        };
        setAddedState("Added");
        await axios
            .patch(
                `${REACT_APP_BASE_URL}/users/update-user-roadtrip/${username}`,
                roadtripDetails
            )
            .then((response) => {
                console.log(response);
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
        await axios
            .get(`${REACT_APP_BASE_URL}/users?spotifyUsername=${username}`)
            .then(async function (response) {
                if (response.data.length != 0) {
                    sendPushNotification(
                        response.data[0]["notificationToken"],
                        "You've been added to a roadtrip!",
                        "Go to MusicMap to view the roadtrip!"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <View style={styles.friendCardContainer} >
            <Image source={{ uri: profilePic }} style={styles.image} />
            <View style={styles.friendCardContent}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1} >
                        {name}
                    </Text>
                </View>
            </View>
            < TouchableHighlight
                onPress={() => { addFriendtoRoadtrip() }}
                disabled={addedState === "Added"}
                style={styles.button}
            >
                <Text>{addedState}</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    friendCardContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "lightgray",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    friendCardContent: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    name: {
        flex: 1,
        fontSize: 15,
        fontWeight: "bold",
    },
    subTitle: {
        color: "gray",
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        marginRight: 30,
        height: 40,
        borderRadius: 6,
    },
});
