import React, { useEffect, useState, useRef } from 'react';
import { Dimensions,Text, View, StyleSheet, ScrollView, RefreshControl, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';
import { MyPieChart } from './graphs/MyPieChart';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

export function StatisticsScreen() {
    const [statistics, setStatistics] = useState([]);
    const [search, onChangeSearch] = React.useState("");

    const onRefresh = React.useCallback(() => {
        setStatistics([]);
    }, []);

    if (statistics.length == 0) {
        axios.get(`${REACT_APP_BASE_URL}/statistics/`).then((response) => {
            // console.log("Tried to get data");
            // console.log(response.data);
            setStatistics(response.data);
        });
    }
    const data = [
        {
            name: "Seoul",
            population: 21500000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            population: 2800000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Beijing",
            population: 527612,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "New York",
            population: 8538000,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Moscow",
            population: 11920000,
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl
                    refreshing={statistics.length == 0}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeSearch}
                    value={search}
                    placeholder="Filter Username"
                />
                {
                    statistics.length == 0 ? <Text></Text> :
                        statistics.map((statistic) => (
                            !statistic.spotifyUsername.includes(search.toLowerCase()) ?
                                <Text></Text> : <Text key={statistic._id}>{statistic.spotifyUsername} has been on {statistic.numTrips} trips</Text>
                        )
                        )
                }
            </View>
            <MyPieChart/>
        </ScrollView>
    );


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
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    }
});