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
import { MyBezierGraph } from "./graphs/MyBezierGraph";

const colors = [
  "#52c2f9",
  "#57a7f9",
  "#578af8",
  "#506bf8",
  "#4149f6",
  "#150ef4",
];

/*

Pie charts are really fucked up right now 

*/

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
  try {
    if (tripId == -1)
      return AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime, aggrData });
    return SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime, tripSongs });
  } catch (e) {
    return <Text> broken </Text>;
  }

}

function AllTripsGraphs({ tripId, myStatistics, myRoadtrips, progressTime, aggrData }) {
  let vibeScore = 0;
  let distance = 0;
  let numSongs = 0;
  let numMinutes = 0;
  let uniqueDestinations = 0;
  let startLocData = [];
  let endLocData = [];
  try {
    // console.log(aggrData.vibeScore);
    vibeScore = (aggrData.vibeScore / Math.max(aggrData.numSongs, 1)).toFixed(2);
    distance = (aggrData.distance).toFixed(2);
    numSongs = aggrData.numSongs;
    numMinutes = (aggrData.numSeconds / 60).toFixed(2);
    uniqueDestinations = aggrData.endCities.size;

    let startCityCount = aggrData.startCityCount;
    startLocData = [];
    let index = 0;
    for (const [key, value] of Object.entries(startCityCount)) {
      // console.log(key);
      // console.log(value);
      if(key == null || value == null)
        continue;
      startLocData.push({
        name: key,
        num: value,
        color: colors[index % colors.length],
        legendFontColor: colors[index % colors.length],
        legendFontSize: 15,
      });
      index++;
    }
    startLocData.push({
      name: "",
      num: (1 - progressTime) * 100,
      //color: "white",
      //legendFontColor: "white",
      //legendFontSize: 0
    });

    let endCityCount = aggrData.endCityCount;
    endLocData = [];
    index = 0;
    for (const [key, value] of Object.entries(endCityCount)) {
      // console.log(key);
      // console.log(value);
      if(key == null || isNaN(value))
        continue;
      endLocData.push({
        name: key,
        num: value,
        color: colors[index % colors.length],
        legendFontColor: colors[index % colors.length],
        legendFontSize: 15,
      });
      index++;
    }
    endLocData.push({
      name: "",
      num: (1 - progressTime) * 100,
      //color: "white",
      //legendFontColor: "white",
      //legendFontSize: 0
    });
  } catch (e) {
    console.log("Borked");
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
      
      <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} data={startLocData} title={"Start Locations"} />
      <MyPieChart roadtrips={myRoadtrips} progressTime={progressTime} data={endLocData} title={"End Locations"} />
    </View>);
}

function SpecificTripGraphs({ tripId, myStatistics, myRoadtrips, progressTime, tripSongs }) {
  let vibeScore = 0;
  let distance = 0;
  let numSongs = 0;
  let numMinutes = 0;
  let topSpeed = 0;
  let fastestSong = "Null";
  let avgSpeed = 0;
  let bezierData = null;
  let topSongs = [["Null",0],["Null",0],["Null",0]];
  let topArtists = [["Null",0],["Null",0],["Null",0]];
  try {
    vibeScore = (tripSongs[tripId]['vibeScore'] / Math.max(tripSongs[tripId]['numSongs'], 1)).toFixed(2);
    console.log(vibeScore);
    distance = (tripSongs[tripId]['distance']).toFixed(2);
    console.log(distance);
    numSongs = tripSongs[tripId]['numSongs'];
    console.log("afdsafd" + numSongs);
    numMinutes = (tripSongs[tripId]['numSeconds'] / 60).toFixed(2);
    console.log("fdsa" + numMinutes);
    topSpeed = tripSongs[tripId]['topSpeed'].toFixed(0);
    console.log("afd" + topSpeed);
    fastestSong = tripSongs[tripId]['fastestSong'];
    console.log("af" + fastestSong);
    avgSpeed = (distance / Math.max(numMinutes,1) * 60).toFixed(0);
    console.log("a" + avgSpeed);
    let distances = tripSongs[tripId]['distances'];
    
    // console.log(tripSongs[tripId]['topSongs']);
    topSongs = tripSongs[tripId]['topSongs'].slice(0,3);
    while(topSongs.length<3)
      topSongs.push(["",0]);
    topArtists = tripSongs[tripId]['topArtists'].slice(0,3);
    while(topArtists.length<3)
      topArtists.push(["",0]);

    let animatedDistances = [];
    let index = 0;

    for (d of distances) {
      if(isNaN(d))
        continue;
      animatedDistances.push(index / Math.max(distances.length,1) <= progressTime ? d * progressTime : 0);
      index++;
    }
    if(animatedDistances.length == 0)
      animatedDistances.push(0);
    bezierData = {
      labels: [],
      datasets: [
        {
          data: animatedDistances,
          color: (opacity = 1) => `rgba(0, 120, 250, ${opacity})`, // optional
          strokeWidth: 2 // optional
        }
      ]
    }
  } catch (e) {
    // console.log("Specifics?");
  }
  return (<View style={{ flex: 1, justifyContent: "left", alignItems: "left", marginBottom: 40, }}>
    <MyProgressRing vibeValue={vibeScore} progressTime={progressTime} />
    <View style={{ marginTop: 30 }}></View>
    <MyBezierGraph title={"Cumulative Distance (miles) By Song"} data={bezierData} />
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
    <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1, marginBottom: 20 }}>
      <View style={styles.boxes}>
        <Text style={styles.title}>Minutes of Listening</Text>
        <Text>
          <Text style={styles.text}>{numMinutes}</Text>
          <Text style={styles.title}>
            min
          </Text>
        </Text>
      </View>
      <View style={styles.boxes}>
        <Text style={styles.title}>Average Speed</Text>
        <Text>
          <Text style={styles.text}>{avgSpeed} </Text>
          <Text style={styles.title}>
            mph
          </Text>
        </Text>
      </View>
    </View>
    <View style={{ justifyContent: 'left', alignItems: 'left', flexDirection: 'row', flex: 1, marginBottom: 20 }}>
      <View style={styles.boxes}>
        <Text style={styles.chartTitle}>Top Songs</Text>
        <Text>
          <Text style={styles.chartText}>{topSongs[0][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topSongs[0][0] == "" ? null : "X"+ topSongs[0][1]}
          </Text>
        </Text>
        <Text>
          <Text style={styles.chartText}>{topSongs[1][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topSongs[1][0] == "" ? null : "X"+ topSongs[1][1]}
          </Text>
        </Text>
        <Text>
          <Text style={styles.chartText}>{topSongs[2][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topSongs[2][0] == "" ? null : "X"+ topSongs[2][1]}
          </Text>
        </Text>
      </View>
      <View style={styles.boxes}>
        <Text style={styles.chartTitle}>Top Artists</Text>
        <Text>
          <Text style={styles.chartText}>{topArtists[0][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topArtists[0][0] == "" ? null : "X"+ topArtists[0][1]}
          </Text>
        </Text>
        <Text>
          <Text style={styles.chartText}>{topArtists[1][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topArtists[1][0] == "" ? null : "X"+ topArtists[1][1]}
          </Text>
        </Text>
        <Text>
          <Text style={styles.chartText}>{topArtists[2][0]} </Text>
          <Text style={styles.chartTextNum}>
            {topArtists[2][0] == "" ? null : "X"+ topArtists[2][1]}
          </Text>
        </Text>
      </View>
    </View>
    <View style={styles.boxes}>
      <Text style={styles.title}>Fastest Song (beta)</Text>
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
  chartTitle: {
    marginHorizontal: 0,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    fontWeight: "bold",
    color: "#0078FA",
    fontSize: 24
  },
  chartText: {
    marginHorizontal: 0,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    fontWeight: "bold",
    color: "#0078FA",
    fontSize: 14
  },
  chartTextNum: {
    marginHorizontal: 0,
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    fontWeight: "bold",
    color: "black",
    fontSize: 14
  },
});