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

export function MyPieChart({data, roadtrips, progressTime, title}) {
    // startLocData.push({
    //     name: "",
    //     num: (1-progressTime)*100,
    //     //color: "white",
    //     //legendFontColor: "white",
    //     //legendFontSize: 0
    // });

    const tempData = [
        {
            name: "fake1",
            num: 1,
            color: "#52c2f9",
            legendFontColor: "#52c2f9",
            legendFontSize: 15,
        },
        {
            name: "fake2",
            num: 1,
            color: "#57a7f9",
            legendFontColor: "#57a7f9",
            legendFontSize: 15,
        },
    ]
    
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>{title}</Text>
            <PieChart
                data={data.length == 0 ? tempData : data}
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