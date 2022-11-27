import { Text, View, StyleSheet, Image } from "react-native";
import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";
import lazyfair from "musicmap/assets/lazyfair.jpg";
import { REACT_APP_BASE_URL } from "@env";
import { PastTripsList } from "musicmap/pages/PastTrips/PastTripMap/PastTripsList";

export function MapScreen() {
  // map size parameters
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = 0.0421;
  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const [songs, setSongs] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);

  // animate/relocate to current location
  const mapRef = useRef();
  const animateMap = () => {
    mapRef.current.animateToRegion(currentLocation, 1000);
  };

  // get songs played in the selected roadtrip
  const getSongs = async (tripId) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/songs/get-trip-songs/${tripId}`)
      .then((response) => {
        setSongs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // something with await/async - not functioning properly
  useEffect(() => {
    if (songs.length !== 0) {
      setCurrentLocation({
        latitude: songs[0].location.latitude,
        longitude: songs[0].location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [songs]);

  useEffect(() => {
    if (currentLocation !== defaultLocation) {
      animateMap();
    }
  }, [currentLocation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          currentLocation === null ? defaultLocation : currentLocation
        }
        showsUserLocation={true}
      >
        {songs.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
            >
              <Callout>
                <Image
                  style={{ alignSelf: "center", width: 50, height: 50 }}
                  source={{ uri: item.imageURL }}
                />
                <Text style={{ textAlign: "center" }}>{item.title}</Text>
                <Text style={{ textAlign: "center" }}>{item.artist}</Text>
                <Text style={{ textAlign: "center" }}>{item.datestamp}</Text>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <PastTripsList getSongs={getSongs} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
