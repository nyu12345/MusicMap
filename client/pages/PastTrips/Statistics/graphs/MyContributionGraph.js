import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import { Dimensions, Text, View, StyleSheet, SafeAreaView } from "react-native";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import dayjs from "dayjs";

export function MyContributionGraph({ roadtrips, progressTime }) {
  // const base_url = `${REACT_APP_BASE_URL}/users/`;

  // Need to get this in the right format
  let counts = {};
  let total = 0;
  for (const trip of roadtrips) {
    let date = dayjs(trip.startDate).format("MM/DD/YY");
    // console.log(date);
    counts[date] = counts[date] ? counts[date] + 1 : 1;
    total += 1;
  }

  let datab = [];
  for (const [key, value] of Object.entries(counts)) {
    datab.push({ date: key, count: value });
  }

  // console.log(datab);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}
    >
      <ContributionGraph
        values={datab}
        endDate={new Date().toISOString().slice(0, 10)}
        numDays={98}
        width={Dimensions.get("window").width - 16}
        height={200}
        squareSize={20}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 120, 250, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
      />
      <Text style={styles.title}>Total {total} Trips</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
    color: "black",
    textAlign: "left",
  },
  chartConfig: {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  },
  title: {
    marginHorizontal: 25,
    flex: 1,
    justifyContent: "right",
    alignItems: "right",
    alignContent: "right",
    fontWeight: "bold",
    color: "#0078FA",
    fontSize: 12,
  },
});
