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
import dayjs from "dayjs";

export function MyBezierGraph({ data, progressTime, title }) {
    const tempdata = {
        labels: [],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
    };
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>{title}</Text>
            <LineChart
                data={data == null ? tempdata : data}
                width={Dimensions.get('window').width - 16} // from react-native
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
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
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        // backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
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