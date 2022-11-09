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

export function StatisticsScreen() {
  // Pull in all the data here once
  const [statistics, setStatistics] = useState([]);
  const [roadtrips, setRoadtrips] = useState([]);
  const [selected, setSelected] = useState("");

  const onRefresh = React.useCallback(() => {
    setStatistics([]);
  }, []);

  // get statistics data from API
  if (statistics.length == 0) {
    axios.get(`${REACT_APP_BASE_URL}/statistics/`).then((response) => {
      // console.log("Tried to get data");
      // console.log(response.data);
      setStatistics(response.data);
    });
  }
  // get roadtrip data from API
  if (roadtrips.length == 0) {
    axios.get(`${REACT_APP_BASE_URL}/roadtrips/`).then((response) => {
      setRoadtrips(response.data);
      setSelected(response.data[0].name);
    });
  }

  return (
    <View>
      <View style={styles.horizontalScroll}>
        <ScrollView horizontal={true} >
          {
            (
              roadtrips.map((roadtrip) =>
                <PastTrip name={roadtrip.name} isSelected={selected==roadtrip.name} mySetSelected={setSelected}></PastTrip>
              )
            )
          }
        </ScrollView>
      </View>
      <ScrollView
      //contentContainerStyle={styles.scrollView}
      style={{height:1000, marginTop:10}}
      refreshControl={
        <RefreshControl
          refreshing={statistics.length == 0}
          onRefresh={onRefresh}
        />
      }
    >
      <StatisticsGraphs myStatistics={statistics} myRoadtrips={roadtrips}></StatisticsGraphs>
    </ScrollView>
    </View>
  );
}

const PastTrip = ({ name, isSelected, mySetSelected}) => {
  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={() => {mySetSelected(name)}} // Set selected
    >
      <View style={styles.icon}>
        <Image source={require('musicmap/assets/sample_pfp.png')} style={styles.image} />
        <View style={isSelected ? styles.bubbleSelected : styles.bubbleNonSelected} >
          <Text style={isSelected ? styles.textSelected : styles.textNonSelected}>{name}</Text>

        </View>

      </View>
    </Pressable>
  );
};
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
    fontSize:12,
  },
  textNonSelected: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize:12,
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
    position:"relative",
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
