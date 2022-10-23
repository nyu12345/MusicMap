import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import { set } from 'react-native-reanimated';
import { REACT_APP_BASE_URL } from '@env';

const overallStatistics = {
    _id: 'ba236b264f3ff33bd',
    name: "jeffreyzl",
    numTrips: 6
};

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function StatisticsScreen() {
    const [statistics, setStatistics] = useState([]);
    const [search, onChangeSearch] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setStatistics([]);
    }, []);

    if (statistics.length == 0 || refreshing) {
        axios.get(`${REACT_APP_BASE_URL}/statistics/`).then((response) => {
            console.log("Tried to get data");
            console.log(response.data);
            setStatistics(response.data);
        });
    }
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
});