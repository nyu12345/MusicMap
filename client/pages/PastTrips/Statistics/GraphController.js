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

export function StatisticsGraphs({ tripId, myStatistics, myRoadtrips, fadeAnim }) {
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
    return AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime });
  return SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime });
}

function AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime }) {
  return (
  <View style={{ flex: 1, justifyContent: "left", alignItems: "left", marginBottom: 40, }}>
    <MyProgressRing vibeValue={0.85} progressTime={progressTime} allData={true} />
    <MyContributionGraph roadtrips={myRoadtrips} progressTime={progressTime} />
    <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1 }}>
      <View style={styles.boxes}>
        <Text style={styles.title}>Total Distance</Text>
        <Text>
          <Text style={styles.text}>857</Text>
          <Text style={styles.title}>
            mi
          </Text>
        </Text>

      </View>
      <View style={styles.boxes}>
        <Text style={styles.title}>Songs</Text>
        <Text style={styles.text}>35</Text>
      </View>
    </View>
    <View style={styles.boxes}>
        <Text style={styles.title}>Minutes of Listening</Text>
        <Text>
          <Text style={styles.text}>325</Text>
        </Text>
      </View>
      <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} />
  </View>);
}

function SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime }) {
  return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <MyProgressRing vibeValue={0.5} progressTime={progressTime} />
    <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} />
    <Text>Wow based on my calculations you went {parseInt(Math.random() * 20) + 80}MPH 🤓 Drive Safe!</Text>
    <Text>🎸 Your most popular music category was Rock 🤟Rock on 😎</Text>
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