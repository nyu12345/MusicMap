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

export function StatisticsGraphs({tripId, myStatistics, myRoadtrips, fadeAnim}) {
    const[search, onChangeSearch] = React.useState("");
    console.log(tripId);
    if(tripId == -1)
      return AllTripsGraphs({tripId, myStatistics, myRoadtrips, fadeAnim});
    return SpecificTripGraphs({tripId, myStatistics, myRoadtrips, fadeAnim});
}

function AllTripsGraphs({tripId, myStatistics, myRoadtrips, fadeAnim}) {
  return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text> All Trips Data</Text>
  </View>);
}

function SpecificTripGraphs({tripId, myStatistics, myRoadtrips, fadeAnim}) {
  return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    {/* <TextInput
      style={styles.input}
      onChangeText={onChangeSearch}
      value={search}
      placeholder="Filter Username"
    />
    {myStatistics.length == 0 ? (
      <Text></Text>
    ) : (
      myStatistics.map((statistic) =>
        !statistic.spotifyUsername.includes(search.toLowerCase()) ? (
          <Text></Text>
        ) : (
          <Text key={statistic._id}>
            {statistic.spotifyUsername} has been on {statistic.numTrips}{" "}
            trips
          </Text>
        )
      )
    )} */}
    <MyProgressRing fadeAnim={fadeAnim}/>
    <MyPieChart roadtrips={myRoadtrips} fadeAnim={fadeAnim}/>
    <Text>Wow based on my calculations you went {parseInt(Math.random()*20)+80}MPH 🤓 Drive Safe!</Text>
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
  });