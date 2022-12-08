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
import { FontAwesome } from '@expo/vector-icons';

export function MyProgressRing({vibeValue,progressTime, allData}) {
    if(isNaN(vibeValue))
        return;
    const base_url = `${REACT_APP_BASE_URL}/users/`;
    const randColor = () => {
        //console.log("#" + Math.floor(Math.random()*6777215+10000000).toString(16).padStart(6, '0').toUpperCase());
        return "#" + Math.floor(Math.random() * 6777215 + 10000000).toString(16).padStart(6, '0').toUpperCase();
        //return "rgb(0, 0, " + (Math.floor(Math.random() * 255)) + ")";
    }
    
    //console.log("switched")
    const data = {
        data: [vibeValue*progressTime]
      };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'left', alignItems: 'left' }}>
            <Animated.View>
            <ProgressChart
                data={data}
                width={Dimensions.get("window").width}
                height={300}
                strokeWidth={50}
                radius={96}
                chartConfig={styles.chartConfig}
                hideLegend={true}
            />
            </Animated.View>
            <Text style={{ marginHorizontal: 40, flex: 1, justifyContent: 'left', alignItems: 'left', fontWeight: "bold", color: "#0078FA", fontSize: 12 }}>
                {allData ? "Average " : ""}VibeScore&trade;
            </Text>
            <Text style={{ marginHorizontal: 40, flex: 1, justifyContent: 'left', alignItems: 'left', fontWeight: "bold", color: "#0078FA", fontSize: 32 }}>
                <Text>
                {parseInt(vibeValue*100)}/100
                </Text>
                <Text style={{fontSize: 12}}>
                    points
                </Text>
            </Text>
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
        backgroundGradientFrom: "#F2F2F2",
        backgroundGradientTo: "#F2F2F2",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 120, 250, ${opacity})`,
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