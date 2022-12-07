import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  Modal,
  View,
  Image,
  Pressable,
} from "react-native";
import MemoryCard from "musicmap/pages/Memories/MemoryCard";
import React, { useState, useCallback, useEffect } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import { VideoScreen } from "musicmap/pages/Memories/VideoScreen";
import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";

export function MemoriesScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [username, setUsername] = useState("");
  const [roadtrips, setRoadtrips] = useState([]);
  const [roadtripIds, setRoadtripIds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRoadtrip, setCurrentRoadtrip] = useState({});

  // get roadtrip data from API
  const getRoadtrips = async () => {
    await getUserRoadtripIds(username);
    await getUserRoadtrips(roadtripIds);
  };


  // get all the roadtrips the current user has been on
  // 1. get current user's username
  const getUsername = async () => {
    const accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response) {
      const responseJson = await response.json();
      setUsername(responseJson.id);
    } else {
      console.log("getUserInfo request returned no response");
    }
  };

  // 2. get current user's info from Mongo with username and then get user's road trip ids
  const getUserRoadtripIds = async (username) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/users/${username}`)
      .then((response) => {
        setRoadtripIds(response.data[0].roadtrips);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 3. get all road trip information from the road trip ids
  const getUserRoadtrips = async (roadtripIds) => {
    // remove duplicate road trips
    const roadtripSet = new Set();
    for (let i = 0; i < roadtripIds.length; i++) {
      roadtripSet.add(roadtripIds[i]);
    }

    const uniqueRoadtripIds = [];
    roadtripSet.forEach((trip) => uniqueRoadtripIds.push(trip));

    console.log("size of roadtripSet: " + roadtripSet.size);

    // get road trip info for all unique road trips
    const uniqueRoadtrips = [];
    for (let i = 0; i < uniqueRoadtripIds.length; i++) {
      const curTripId = uniqueRoadtripIds[i];
      await axios
        .get(`${REACT_APP_BASE_URL}/roadtrips/${curTripId}`)
        .then((response) => {
          uniqueRoadtrips.push(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
      // if(uniqueRoadtrips.length-1 != i)
      //   uniqueRoadtrips.push({});
      // uniqueRoadtrips[i]['images'] = []
      await axios
        .get(`${REACT_APP_BASE_URL}/images/get-trip-images/${curTripId}`)
        .then((response) => {
          if (response.data.length > 0) {
            console.log("getImages images: " + JSON.stringify(response.data))
            uniqueRoadtrips[i]['images'] = response.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      
      await axios
        .get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${curTripId}`)
        .then((response) => {
          // console.log("Song data: ");
          // console.log(response);
          // console.log(response.data);
          let popSongs = {};
          for(song of response.data) {
            // console.log(song.songInfo.trackPreviewURL)
            if(!(popSongs.hasOwnProperty(song.spotifyId)))
              popSongs[song.songInfo.trackPreviewURL] = 1;
            popSongs[song.songInfo.trackPreviewURL] += 1;
          }
          // console.log(popSongs)

          let maxPlayed = 0;
          let maxURL = "";
          for (const [key, value] of Object.entries(popSongs)) {
            if(value > maxPlayed) {
              maxPlayed = value;
              maxURL = key;
            }
          }
          // console.log("URL: " + maxURL)
          uniqueRoadtrips[i]['songURL'] = maxURL;

        })
        .catch((err) => {
          console.log(err);
        });
    }

    setRoadtrips(uniqueRoadtrips);
    console.log(uniqueRoadtrips);
  };

  // initial rendering
  useEffect(() => {
    getUsername();
  }, []);

  // after getUsername from initial rendering, get roadtrips using that username
  useEffect(() => {
    (async () => {
      if (username != "") {
        getRoadtrips();
      }
    })();
  }, [username]);

  useEffect(() => {
    // get roadtrip data from API upon refresh
    (async () => {
      if (username != "" && roadtrips.length == 0) {
        getRoadtrips();
      }
    })();
  }, [roadtrips]);

  const onRefresh = useCallback(() => {
    console.log("handleRefresh");
    setRoadtrips([]);
  }, []);

  const fakeRoadtripsData = [
    {
      name: "Fun Trip",
      startLocation: "Durham, NC",
      destination: "Washington DC",
      startDate: "2022-11-10T05:00:00.000+00:00",
      endDate: "2022-11-14T05:00:00.000+00:00",
      images: [
        {
          __v: 0,
          _id: "638ff8774f4388d78059ff84",
          datestamp: "06/12/2022, 21:20:39",
          imageURL: "file:///var/mobile/Containers/Data/Application/3BC125A9-7B97-4FD2-9313-44602837D197/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmusicmap-cd653aae-17b3-45d9-816b-32dbe7bbae9c/ImagePicker/9A6F0A63-437A-423F-B404-72C6E4D29F91.png",
          location: {
            latitude: 36.00244964632923,
            longitude: -78.93366090627352,
            name: "Durham, NC",
          },
          tripId: "638ff8684f4388d78059ff7f",
        },
      ],
      coverImage:
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
    {
      name: "Even More Fun Trip",
      startLocation: "Washington DC",
      destination: "New York, New York",
      startDate: "2022-11-10T05:00:00.000+00:00",
      endDate: "2022-11-14T05:00:00.000+00:00",
      startDate: "2022-12-02T05:00:00.000+00:00",
      endDate: "2022-12-03T05:00:00.000+00:00",
      images: [
      ],
      coverImage:
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
  ];

  return (
    <SafeAreaView style={{ bottom: 10 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <VideoScreen currentRoadtrip={currentRoadtrip}></VideoScreen>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ top: 8 }}
      >
        {roadtrips.map((item, index) => (
          <MemoryCard roadtripData={item} key={index} setModalVisible={setModalVisible} setCurrentRoadtrip={setCurrentRoadtrip} />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

async function getMostPlayedSong({ tripId }) {
  let popSong = {};
  await axios
    .get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${tripId}`)
    .then((response) => {
      console.log("Song data: ");
      console.log(response);
      console.log(response.data);

    })
    .catch((err) => {
      console.log(err);
    });


}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
