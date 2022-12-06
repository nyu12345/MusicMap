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
} from "react-native";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { MyProgressRing } from "./graphs/MyProgressRing";
import { MyPieChart } from "./graphs/MyPieChart";
import { MyContributionGraph } from "./graphs/MyContributionGraph";

export function StatisticsGraphs({ tripId, myStatistics, myRoadtrips, fadeAnim, tripSongs, aggrData }) {
  const [search, onChangeSearch] = React.useState("");
  const [progressTime, setProgressTime] = useState(0);
  useEffect(() => {
    // Listen the animation variable and update chart variable
    fadeAnim.addListener(({ value }) => {
      //console.log('🚀 ~ animationValue.addListener ~ value', value);
      setProgressTime(value);
    });

  }, []);
  // console.log(tripId);
  if (tripId == -1)
    return AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime, aggrData });
  return SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime, tripSongs });
}

function AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime, aggrData }) {
  let vibeScore = 0;
  let distance = 0;
  let numSongs = 0;
  let numMinutes = 0;
  let uniqueDestinations = 0;
  try {
    // console.log(aggrData.vibeScore);
    vibeScore = (aggrData.vibeScore / Math.max(aggrData.numSongs, 1)).toFixed(2);
    distance = (aggrData.distance).toFixed(2);
    numSongs = aggrData.numSongs;
    numMinutes = (aggrData.numSeconds / 60).toFixed(0);
    uniqueDestinations = aggrData.endCities.size;
  } catch (e) {

  }
  return (
    <View style={{ flex: 1, justifyContent: "left", alignItems: "left", marginBottom: 40, }}>
      <MyProgressRing vibeValue={vibeScore} progressTime={progressTime} allData={true} />
      <MyContributionGraph roadtrips={myRoadtrips} progressTime={progressTime} />
      <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1 }}>
        <View style={styles.boxes}>
          <Text style={styles.title}>Total Distance</Text>
          <Text>
            <Text style={styles.text}>{distance}</Text>
            <Text style={styles.title}>
              mi
            </Text>
          </Text>

        </View>
        <View style={styles.boxes}>
          <Text style={styles.title}>Songs</Text>
          <Text style={styles.text}>{numSongs}</Text>
        </View>
      </View>
      <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1 }}>
        <View style={styles.boxes}>
          <Text style={styles.title}>Song time</Text>
          <Text>
            <Text style={styles.text}>{numMinutes}</Text>
            <Text style={styles.title}>
              min
            </Text>
          </Text>
        </View>
        <View style={styles.boxes}>
          <Text style={styles.title}>Unique Destinations</Text>
          <Text>
            <Text style={styles.text}>{uniqueDestinations}</Text>
          </Text>
        </View>
      </View>
      <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} />
    </View>);
}

function SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime, tripSongs }) {
  let vibeScore = 0;
  let distance = 0;
  let numSongs = 0;
  let numMinutes = 0;
  let topSpeed = 0;
  let fastestSong = "Null";
  try {
    vibeScore = (tripSongs[tripId]['vibeScore'] / Math.max(tripSongs[tripId]['numSongs'], 1)).toFixed(2);
    distance = (tripSongs[tripId]['distance']).toFixed(2);
    numSongs = tripSongs[tripId]['numSongs'];
    numMinutes = (tripSongs[tripId]['numSeconds'] / 60).toFixed(0);
    topSpeed = tripSongs[tripId]['topSpeed'].toFixed(0);
    fastestSong = tripSongs[tripId]['fastestSong'];
  } catch (e) {

  }
  return (<View style={{ flex: 1, justifyContent: "left", alignItems: "left", marginBottom: 40, }}>
    <MyProgressRing vibeValue={vibeScore} progressTime={progressTime} />
    <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} />
    <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1 }}>
      <View style={styles.boxes}>
        <Text style={styles.title}>Total Distance</Text>
        <Text>
          <Text style={styles.text}>{distance}</Text>
          <Text style={styles.title}>
            mi
          </Text>
        </Text>

      </View>
      <View style={styles.boxes}>
        <Text style={styles.title}>Songs</Text>
        <Text style={styles.text}>{numSongs}</Text>
      </View>
    </View>
    <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1 }}>
      <View style={styles.boxes}>
        <Text style={styles.title}>Minutes of Listening</Text>
        <Text>
          <Text style={styles.text}>{numMinutes}</Text>
          <Text style={styles.title}>
            min
          </Text>
        </Text>
      </View>
    </View>
    <View style={styles.boxes}>
        <Text style={styles.title}>Fastest Song (may not be accurate)</Text>
        <Text>
        <Text style={styles.text}>{fastestSong} @ {topSpeed} </Text>
          <Text style={styles.title}>
            mph
          </Text>
        </Text>
      </View>
  </View>);
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
  boxes: {
    marginHorizontal: 40,
    marginTop: 20,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
  },
  text: {
    marginHorizontal: 0,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    fontWeight: "bold",
    color: "#0078FA",
    fontSize: 32
  },
  title: {
    marginHorizontal: 0,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    fontWeight: "bold",
    color: "#0078FA",
    fontSize: 12
  },
});