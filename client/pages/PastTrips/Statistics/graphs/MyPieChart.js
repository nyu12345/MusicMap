import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { Dimensions, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { REACT_APP_BASE_URL } from '@env';
import axios from 'axios';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

const colors = [
    "#52c2f9",
    "#57a7f9",
    "#578af8",
    "#506bf8",
    "#4149f6",
    "#150ef4",
];

export function MyPieChart({roadtrips, progressTime}) {
    // const base_url = `${REACT_APP_BASE_URL}/users/`;
    function randColor(index) {
        //console.log("#" + Math.floor(Math.random()*6777215+10000000).toString(16).padStart(6, '0').toUpperCase());
        return "#" + Math.floor(477721*index+500000).toString(16).padStart(6, '0').toUpperCase();
        //return "rgb(0, 0, " + (Math.floor(Math.random() * 255)) + ")";
    }
    
    
    let datab = [];
    let counts = {};
    for (const trip of roadtrips) {
        counts[trip.startLocation] = counts[trip.startLocation] ? counts[trip.startLocation] + 1 : 1
    }
    let index = 0;
    for (const city of Object.keys(counts)) {
        datab.push({
            name: city,
            num: counts[city],
            color: colors[index%colors.length],
            legendFontColor: colors[index%colors.length],
            legendFontSize: 15,
        });
        index++;
    }
    datab.push({
        name: "",
        num: (1-progressTime)*100,
        //color: "white",
        //legendFontColor: "white",
        //legendFontSize: 0
    });

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>Start Locations</Text>
            <PieChart
                data={datab}
                width={Dimensions.get("window").width}
                height={200}
                chartConfig={styles.chartConfig}
                accessor={"num"}
                backgroundColor={"transparent"}
            />
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
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 120, 250, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 120, 250, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    },
    title: {
        marginHorizontal: 25,
        flex: 1,
        justifyContent: 'right',
        alignItems: 'right',
        alignContent: 'right',
        fontWeight: "bold",
        color: "#0078FA",
        fontSize: 12
      },
})