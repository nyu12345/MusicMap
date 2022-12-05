import {
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import MemoryCard from "musicmap/pages/Memories/MemoryCard";
import React, { useState, useCallback, useEffect } from "react";
import { REACT_APP_BASE_URL } from "@env";
import axios from "axios";

export function MemoriesScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [roadtrips, setRoadtrips] = useState([]);
  const [roadtripsWImages, setRoadtripsWImages] = useState([]);

  // get roadtrip data from API (should be just users' roadtrips)
  const getRoadtrips = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/roadtrips/`)
      .then((response) => {
        setRoadtrips(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO: waiting for merge of image branch
  // use roadtrip ID to get images from each of the roadtrips
  // return list of imageURLs associated with that roadtrip ID
  const getImages = async (tripId) => {
    const endpointResponse = null;
    await axios
      .get(`${REACT_APP_BASE_URL}/images/get-trip-images/${tripId}`)
      .then((response) => {
        endpointResponse = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    const imageURLs = [];
    for (let i = 0; i < endpointResponse.length; i++) {
      imageURLs.push(endpointResponse[i].imageURL);
    }

    return imageURLs;
  };

  // generate random number
  const generateRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  // add images array as a field to the list of roadtrips?
  const getRoadtripsAndImages = () => {
    const roadtripsWithImages = [];
    for (let i = 0; i < roadtrips.length; i++) {
      const tripID = roadtrips[i]._id;
      const images = getImages(tripID);
      const coverImageIdx = Math.random(0, images.length);
      roadtripsWithImages.push({
        name: roadtrips[i].name,
        startLocation: roadtrips[i].startLocation,
        destination: roadtrips[i].destination,
        startDate: roadtrips[i].startDate,
        endDate: roadtrips[i].endDate,
        images: images,
        coverImage: images[coverImageIdx],
      });
    }
    setRoadtripsWImages(roadtripsWithImages);
  };

  // handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRoadtrips()
      .then(getRoadtripsAndImages())
      .then(() => setRefreshing(false));
  }, []);

  // useEffect(() => {
  //   if (roadtrips.length !== 0) {
  //     getRoadtripsAndImages();
  //   }
  // }, [roadtrips])

  const fakeRoadtripsData = [
    {
      name: "Fun Trip",
      startLocation: "Durham, NC",
      destination: "Washington DC",
      startDate: "2022-11-10T05:00:00.000+00:00",
      endDate: "2022-11-14T05:00:00.000+00:00",
      images: [
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6g",
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
      ],
      coverImage:
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
    {
      name: "Even More Fun Trip",
      startLocation: "Washington DC",
      destination: "New York, New York",
      startDate: "2022-11-10T05:00:00.000+00:00",
      endDate: "2022-11-14T05:00:00.000+00:00",
      startDate: "2022-12-02T05:00:00.000+00:00",
      endDate: "2022-12-03T05:00:00.000+00:00",
      images: [
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6g",
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
      ],
      coverImage:
        "https://i.scdn.co/image/ab6775700000ee85601521a5282a3797015eeed6",
    },
  ];

  return (
    <SafeAreaView style={{ bottom: 10 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ top: 8 }}
      >
        {fakeRoadtripsData.map((item, index) => (
          <MemoryCard roadtripData={item} key={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});