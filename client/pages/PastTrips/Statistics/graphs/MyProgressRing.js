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
    SafeAreaView,
    Animated,
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

export function MyProgressRing({fadeAnim}) {
    const [progressTime, setProgressTime] = useState(0);
    const base_url = `${REACT_APP_BASE_URL}/users/`;
    const randColor = () => {
        //console.log("#" + Math.floor(Math.random()*6777215+10000000).toString(16).padStart(6, '0').toUpperCase());
        return "#" + Math.floor(Math.random() * 6777215 + 10000000).toString(16).padStart(6, '0').toUpperCase();
        //return "rgb(0, 0, " + (Math.floor(Math.random() * 255)) + ")";
    }
    
    useEffect(() => {
        // Listen the animation variable and update chart variable
        fadeAnim.addListener(({ value }) => {
          //console.log('🚀 ~ animationValue.addListener ~ value', value);
          setProgressTime(value);
        });
    
      }, []);
    //console.log("switched")
    const data = {
        labels: ["Swim", "Bike", "Run"], // optional
        data: [0.3*progressTime, 0.5*progressTime, 0.2*progressTime]
      };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: "bold" }}>Progress</Text>
            <Animated.View>
            <ProgressChart
                data={data}
                width={Dimensions.get("window").width}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={styles.chartConfig}
                hideLegend={false}
            />
            </Animated.View>
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
        backgroundGradientFrom: "lightblue",
        backgroundGradientTo: "white",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    }
})