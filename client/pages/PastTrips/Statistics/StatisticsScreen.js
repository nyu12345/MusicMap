import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TextInput,
  Image,
  Pressable,
  Animated,
} from "react-native";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { MyPieChart } from "./graphs/MyPieChart";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { StatisticsGraphs } from "./GraphController";
import dayjs from "dayjs";

export function StatisticsScreen() {
  try {
    return <StatisticsScreenHelper />;
  } catch (e) {
    console.log("Statistsfkdlsj fdks brokenfds. ");
    return <Text> rbrokfodsfklds </Text>;
  }
}

export function StatisticsScreenHelper() {
  // Pull in all the data here once
  const [username, setUsername] = useState("");
  const [roadtripIds, setRoadtripIds] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [roadtrips, setRoadtrips] = useState([]);
  const [tripSongs, setTripSongs] = useState({});
  const [aggrData, setAggrData] = useState({});
  const [selected, setSelected] = useState("");

  // setSelected("Default");

  const onRefresh = React.useCallback(() => {
    setStatistics([]);
    setRoadtrips([]);
  }, []);

  // get statistics data from API
  if (statistics.length == 0) {
    axios.get(`${REACT_APP_BASE_URL}/statistics/`).then((response) => {
      // console.log("Tried to get data");
      // console.log(response.data);
      setStatistics(response.data);
    });
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Listen the animation variable and update chart variable
    fadeAnim.setValue(0);
  }, []);
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: false,
  }).start();

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
    }

    setRoadtrips(uniqueRoadtrips);
  };

  // get roadtrip data from API
  const getRoadtrips = async () => {
    await getUserRoadtripIds(username);
    await getUserRoadtrips(roadtripIds);
  };

  try {
    if (roadtrips.length == 0) {
      getRoadtrips(); 
      let trip_song_map = {};
      let aggrDataCollection = {};
      aggrDataCollection["distance"] = 0;
      aggrDataCollection["numSongs"] = 0;
      aggrDataCollection["numSeconds"] = 0;
      aggrDataCollection["vibeScore"] = 0;
      aggrDataCollection["endCities"] = new Set();
      aggrDataCollection["startCityCount"] = {};
      aggrDataCollection["endCityCount"] = {};

      for (let i = 0; i < roadtrips.length; i++) {
        const rt = roadtrips[i];
        if (rt._id == null) {
          console.log("It is null");
        }
        axios
          .get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${rt._id}`)
          .then((response) => {
            let s1 = response.data;
            s1.sort(function (a, b) {
              return a.datestamp - b.datestamp;
            });
            trip_song_map[rt._id] = {};
            trip_song_map[rt._id]["songCount"] = {};
            trip_song_map[rt._id]["artistCount"] = {};
            trip_song_map[rt._id]["songs"] = s1;
            trip_song_map[rt._id]["distances"] = [];
            let totalDistance = 0;
            let numSongs = 0;
            let numSeconds = 0;
            let lastLat = 9999999;
            let lastLong = 9999999;
            let tempVibeScore = 0;
            let lastDate = "";
            let cumuluativeDistance = 0;

            let highestSpeed = 0;
            let fastestSong = "None";
            for (const s of s1) {
              try {
                numSongs += 1;
                if (!trip_song_map[rt._id]["songCount"].hasOwnProperty(s.title))
                  trip_song_map[rt._id]["songCount"][s.title] = 1;
                trip_song_map[rt._id]["songCount"][s.title] += 1;
                if (
                  !trip_song_map[rt._id]["artistCount"].hasOwnProperty(s.artist)
                )
                  trip_song_map[rt._id]["artistCount"][s.artist] = 1;
                trip_song_map[rt._id]["artistCount"][s.artist] += 1;
                let curLat = s.location.latitude;
                let curLong = s.location.longitude;
                tempVibeScore += calcVibeScore(s);
                if (lastLat != 9999999) {
                  let currDate = dayjs(s.datestamp);
                  numSeconds += (currDate - lastDate) / 1000;
                  let timeDifferenceHours = (currDate - lastDate) / 3600000;

                  let distanceSinceLast = getDistanceFromLatLonInMi(
                    lastLat,
                    lastLong,
                    curLat,
                    curLong
                  );
                  cumuluativeDistance += distanceSinceLast;
                  let mph = distanceSinceLast / timeDifferenceHours;
                  if (mph > highestSpeed) {
                    highestSpeed = mph;
                    fastestSong = s.title;
                  }
                  trip_song_map[rt._id]["distances"].push(cumuluativeDistance);
                  totalDistance += distanceSinceLast;
                }
                lastDate = dayjs(s.datestamp);
                lastLat = curLat;
                lastLong = curLong;
              } catch (e) {
                console.log("Parsing song failed id: " + rt._id);
              }
            }
            trip_song_map[rt._id]["numSongs"] = numSongs;
            trip_song_map[rt._id]["numSeconds"] = numSeconds;
            trip_song_map[rt._id]["distance"] = totalDistance;
            trip_song_map[rt._id]["vibeScore"] = tempVibeScore;
            trip_song_map[rt._id]["topSpeed"] = highestSpeed;
            trip_song_map[rt._id]["fastestSong"] = fastestSong;

            let items = Object.keys(trip_song_map[rt._id]["songCount"]).map(
              function (key) {
                return [key, trip_song_map[rt._id]["songCount"][key]];
              }
            );
            items.sort(function (first, second) {
              return second[1] - first[1];
            });
            trip_song_map[rt._id]["topSongs"] = items;

            items = Object.keys(trip_song_map[rt._id]["artistCount"]).map(
              function (key) {
                return [key, trip_song_map[rt._id]["artistCount"][key]];
              }
            );
            items.sort(function (first, second) {
              return second[1] - first[1];
            });
            trip_song_map[rt._id]["topArtists"] = items;

            aggrDataCollection["distance"] += totalDistance;
            aggrDataCollection["numSongs"] += numSongs;
            aggrDataCollection["numSeconds"] += numSeconds;
            aggrDataCollection["vibeScore"] += tempVibeScore;
            aggrDataCollection["endCities"].add(rt.destination);
            if (
              aggrDataCollection["startCityCount"].hasOwnProperty(
                rt.startLocation
              )
            )
              aggrDataCollection["startCityCount"][rt.startLocation] += 1;
            else aggrDataCollection["startCityCount"][rt.startLocation] = 1;
            if (
              aggrDataCollection["endCityCount"].hasOwnProperty(
                rt.startLocation
              )
            )
              aggrDataCollection["endCityCount"][rt.destination] += 1;
            else aggrDataCollection["endCityCount"][rt.destination] = 1;
          });
        setTripSongs(trip_song_map);
        setAggrData(aggrDataCollection);
        setSelected(-1);
      }
    }
  } catch (e) {
    console.log("data collection is broken");
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.horizontalScroll}>
        <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
          <AllTrips
            key={-1}
            name={"All Roadtrips"}
            isSelected={selected == -1}
            mySetSelected={setSelected}
            fadeAnim={fadeAnim}
          ></AllTrips>
          {roadtrips.map((roadtrip) => (
            <PastTrip
              key={roadtrip._id}
              roadtrip={roadtrip}
              isSelected={selected == roadtrip._id}
              mySetSelected={setSelected}
              fadeAnim={fadeAnim}
            ></PastTrip>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        //contentContainerStyle={styles.scrollView}
        // style={{ height: 1000, marginTop: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={statistics.length == 0}
            onRefresh={onRefresh}
          />
        }
      >
        <StatisticsGraphs
          tripId={selected}
          myStatistics={statistics}
          myRoadtrips={roadtrips}
          fadeAnim={fadeAnim}
          tripSongs={tripSongs}
          aggrData={aggrData}
        ></StatisticsGraphs>
      </ScrollView>
    </View>
  );
}

const AllTrips = ({ name, isSelected, mySetSelected, fadeAnim }) => {
  const onP = () => {
    mySetSelected(-1);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={onP} // Set selected and reset fade
    >
      <View style={styles.icon}>
        <Image
          source={require("musicmap/assets/earth.jpeg")}
          style={styles.image}
        />
        <View
          style={isSelected ? styles.bubbleSelected : styles.bubbleNonSelected}
        >
          <Text
            style={isSelected ? styles.textSelected : styles.textNonSelected}
          >
            {name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const PastTrip = ({ roadtrip, isSelected, mySetSelected, fadeAnim }) => {
  const [images, setImages] = useState([]);
  const [coverPic, setCoverPic] = useState("https://reneeroaming.com/wp-content/uploads/2020/08/Best-National-Park-Road-Trip-Itinerary-Grand-Teton-National-Park-Van-Life-819x1024.jpg");

  // get images for current trip
  const getImages = async (tripId) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/images/get-trip-images/${tripId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setImages(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // initial rendering - get profile pic for roadtrip
  useEffect(() => {
    getImages(roadtrip._id);
  }, []);

  // set cover image
  useEffect(() => {
    if (images.length != 0) {
      setCoverPic(images[0].imageURL);
    }
  }, [images]);

  const selectTrip = () => {
    mySetSelected(roadtrip._id);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={selectTrip} // Set selected and reset fade
    >
      <View style={styles.icon}>
        <Image
          source={{uri: coverPic}}
          style={styles.image}
        />
        <View
          style={isSelected ? styles.bubbleSelected : styles.bubbleNonSelected}
        >
          <Text
            style={isSelected ? styles.textSelected : styles.textNonSelected}
          >
            {roadtrip.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 0.621371;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calcVibeScore(song) {
  let score = 0;
  try {
    if (song.songInfo) {
      score += song.songInfo.acousticness;
      score += song.songInfo.danceability;
      score += song.songInfo.energy;
      score += song.songInfo.instrumentalness;
      score += song.songInfo.liveness;
      score += song.songInfo.speechiness;
      score += song.songInfo.valence;
    }
  } catch (e) {}
  if (isNaN(score)) return 0;
  return score / 7;
}

const styles = StyleSheet.create({
  bubbleSelected: {
    backgroundColor: "#0078fe",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 20,
  },
  bubbleNonSelected: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderRadius: 20,
  },
  textSelected: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  textNonSelected: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginRight: -20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalScroll: {
    margin: 20,
    position: "relative",
    marginBottom: -10,
  },
  chartConfig: {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  },
});
