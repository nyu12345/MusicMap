import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, Button, FlatList } from 'react-native';
import axios from 'axios';
import { set } from 'react-native-reanimated';

const overallStatistics = {
    _id: 'ba236b264f3ff33bd',
    name: "jeffreyzl",
    numTrips: 6
};

export function StatisticsScreen() {
    const [statistics, setStatistics] = useState([]);
    const base_url = "10.197.196.100";

    // Invoking get method to perform a GET request
    //   axios.get(`http://localhost:6000/users/`).then((response) => {
    //     console.log("Tried to get data");
    //     console.log(response.data);
    //   });
    if (statistics.length == 0) {
        axios.get(`http://${base_url}:6000/users/`).then((response) => {
            console.log("Tried to get data");
            console.log(response.data);
            setStatistics(response.data);
        });
        //console.log(statistics[0])
    }
    else {
        console.log("Printing");
        //console.log(statistics[0]);
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                statistics.length == 0 ? <Text></Text> :
                statistics.map((statistic) => (
                    <Text>{statistic.name} has a username {statistic.spotifyUsername}</Text>
                )
                )
            }
        </View>
    );
}