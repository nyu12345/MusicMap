import React, { useCallback, useState, useMemo, useRef } from 'react';
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

export function MyPieChart() {
    const base_url = `${REACT_APP_BASE_URL}/users/`;
    const [roadtrips, setRoadtrips] = useState([]);
    const randColor = () =>  {
        //console.log("#" + Math.floor(Math.random()*6777215+10000000).toString(16).padStart(6, '0').toUpperCase());
        return "#" + Math.floor(Math.random()*6777215+10000000).toString(16).padStart(6, '0').toUpperCase();
    }

    // get roadtrip data from API
    if (roadtrips.length == 0) {
        axios.get(`${REACT_APP_BASE_URL}/roadtrips/`).then((response) => {
            setRoadtrips(response.data);
        });
    } else {
        // console.log('printing');
    }
    let datab = [];
    let counts = {};
    for (const trip of roadtrips) {
        counts[trip.startLocation] = counts[trip.startLocation] ? counts[trip.startLocation] + 1 : 1
    }
    for (const city of Object.keys(counts)) {
        datab.push({
            name: city,
            num: counts[city],
            color: randColor(),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        });
    }





    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{fontWeight: "bold"}}>Start Locations</Text>
            <PieChart
                data={datab}
                width={Dimensions.get("window").width}
                height={200}
                chartConfig={styles.chartConfig}
                accessor={"num"}
                backgroundColor={"transparent"}
            />
        </SafeAreaView>
        // <View>
        //     <Text>Bezier Line Chart</Text>
        //     <LineChart
        //         data={{
        //             labels: ["January", "February", "March", "April", "May", "June"],
        //             datasets: [
        //                 {
        //                     data: [
        //                         Math.random() * 100,
        //                         Math.random() * 100,
        //                         Math.random() * 100,
        //                         Math.random() * 100,
        //                         Math.random() * 100,
        //                         Math.random() * 100
        //                     ]
        //                 }
        //             ]
        //         }}
        //         width={Dimensions.get("window").width} // from react-native
        //         height={220}
        //         yAxisLabel="$"
        //         yAxisSuffix="k"
        //         yAxisInterval={1} // optional, defaults to 1
        //         chartConfig={{
        //             backgroundColor: "#e26a00",
        //             backgroundGradientFrom: "#fb8c00",
        //             backgroundGradientTo: "#ffa726",
        //             decimalPlaces: 2, // optional, defaults to 2dp
        //             color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        //             labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        //             style: {
        //                 borderRadius: 16
        //             },
        //             propsForDots: {
        //                 r: "6",
        //                 strokeWidth: "2",
        //                 stroke: "#ffa726"
        //             }
        //         }}
        //         bezier
        //         style={{
        //             marginVertical: 8,
        //             borderRadius: 16
        //         }}
        //     />
        // </View>
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
})