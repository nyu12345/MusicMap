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
  Animated
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
  // Pull in all the data here once
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

  // get roadtrip data from API
  if (roadtrips.length == 0) {
    axios.get(`${REACT_APP_BASE_URL}/roadtrips/`).then((response) => {
      setRoadtrips(response.data);
      const rts = response.data;
      let trip_song_map = {};
      // console.log(rts.length);
      // let index = 0;
      let aggrDataCollection = {};
      aggrDataCollection['distance'] = 0;
      aggrDataCollection['numSongs'] = 0;
      aggrDataCollection['numSeconds'] = 0;
      aggrDataCollection['vibeScore'] = 0;
      aggrDataCollection['endCities'] = new Set();
      for (const rt of rts) {
        // if (index >= 1)
        //   break;
        if (rt._id == null)
          console.log("It is null");
        axios.get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${rt._id}`)
          .then((response) => {
            // console.log("Returning data");
            // console.log(rt._id);
            // console.log(response.data);
            // trip_song_map[rt._id] = [];
            let s1 = response.data;
            s1.sort(function (a, b) {
              return a.datestamp - b.datestamp;
            });
            trip_song_map[rt._id] = {};
            trip_song_map[rt._id]['songs'] = s1;
            let totalDistance = 0;
            let numSongs = 0;
            let numSeconds = 0;
            let lastLat = 9999999;
            let lastLong = 9999999;
            let tempVibeScore = 0;
            let lastDate = "";

            let highestSpeed = 0;
            let fastestSong = "None";
            for (const s of s1) {
              try {
                numSongs += 1;
                numSeconds += s.songInfo.duration_ms / 1000;
                let curLat = s.location.latitude;
                let curLong = s.location.longitude;
                tempVibeScore += calcVibeScore(s);
                // console.log("Printing");
                // console.log("Calculated vs: " + tempVibeScore);
                if (lastLat != 9999999) {
                  let currDate = dayjs(s.datestamp);
                  let timeDifference =(currDate - lastDate)/3600000;

                  let distanceSinceLast = getDistanceFromLatLonInMi(lastLat, lastLong, curLat, curLong);
                  let mph = distanceSinceLast/timeDifference;
                  if(mph>highestSpeed) {
                    highestSpeed = mph;
                    fastestSong = s.title;
                  }

                  totalDistance += distanceSinceLast;
                }
                lastDate = dayjs(s.datestamp);
                lastLat = curLat;
                lastLong = curLong;
              } catch (e) {
                console.log("Parsing song failed id: " + rt._id);
              }
            }
            trip_song_map[rt._id]['numSongs'] = numSongs;
            trip_song_map[rt._id]['numSeconds'] = numSeconds;
            trip_song_map[rt._id]['distance'] = totalDistance;
            trip_song_map[rt._id]['vibeScore'] = tempVibeScore;
            trip_song_map[rt._id]['topSpeed'] = highestSpeed;
            trip_song_map[rt._id]['fastestSong'] = fastestSong;
            aggrDataCollection['distance'] += totalDistance;
            aggrDataCollection['numSongs'] += numSongs;
            aggrDataCollection['numSeconds'] += numSeconds;
            aggrDataCollection['vibeScore'] += tempVibeScore;
            aggrDataCollection['endCities'].add(rt.destination);
            // console.log("Aggr: " + aggrDataCollection['vibeScore']);
            // console.log("Songs: " + numSongs + ", Seconds: " + numSeconds + ", Distance: " + totalDistance);

            // console.log(trip_song_map.length);
          })
        // console.log(trip_song_map);
        // index+=1;
      }
      // console.log("Total vibescore: " + aggrDataCollection['vibeScore']);
      setTripSongs(trip_song_map);
      setAggrData(aggrDataCollection);
      setSelected(-1);

      // console.log(trip_song_map['638d612f924a417ee1633a3b']);
      // console.log("Printing:     ---------------------");
      // console.log(tripSongs['638d612f924a417ee1633a3b']);
    });

  }
  return (
    <View style={{ flex: 1 }} >
      <View style={styles.horizontalScroll}>
        <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
          <AllTrips key={-1} name={"All Roadtrips"} isSelected={selected == -1} mySetSelected={setSelected} fadeAnim={fadeAnim}></AllTrips>
          {
            (
              roadtrips.map((roadtrip) =>
                <PastTrip key={roadtrip._id} roadtrip={roadtrip} isSelected={selected == roadtrip._id} mySetSelected={setSelected} fadeAnim={fadeAnim} ></PastTrip>
              )
            )
          }
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
        <StatisticsGraphs tripId={selected} myStatistics={statistics} myRoadtrips={roadtrips} fadeAnim={fadeAnim} tripSongs={tripSongs} aggrData={aggrData}></StatisticsGraphs>
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
  }
  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={onP} // Set selected and reset fade
    >
      <View style={styles.icon}>
        <Image source={require('musicmap/assets/earth.jpeg')} style={styles.image} />
        <View style={isSelected ? styles.bubbleSelected : styles.bubbleNonSelected} >
          <Text style={isSelected ? styles.textSelected : styles.textNonSelected}>{name}</Text>

        </View>

      </View>
    </Pressable>
  );
};

const PastTrip = ({ roadtrip, isSelected, mySetSelected, fadeAnim }) => {
  const onP = () => {
    mySetSelected(roadtrip._id);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }
  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={onP} // Set selected and reset fade
    >
      <View style={styles.icon}>
        <Image source={require('musicmap/assets/sample_pfp.png')} style={styles.image} />
        <View style={isSelected ? styles.bubbleSelected : styles.bubbleNonSelected} >
          <Text style={isSelected ? styles.textSelected : styles.textNonSelected}>{roadtrip.name}</Text>

        </View>

      </View>
    </Pressable>
  );
};

function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 0.621371;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function calcVibeScore(song) {
  let score = 0;
  try {
    if (song.songInfo) {
      // console.log(song.songInfo.ac)
      score += song.songInfo.acousticness;
      score += song.songInfo.danceability;
      score += song.songInfo.energy;
      score += song.songInfo.instrumentalness;
      score += song.songInfo.liveness;
      score += song.songInfo.speechiness;
      score += song.songInfo.valence;
    }
  } catch (e) {

  }
  if(isNaN(score))
    return 0;
  return score/7;
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
    //marginBottom: 15,
    marginTop: 5,
    //maxWidth: 500,

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
