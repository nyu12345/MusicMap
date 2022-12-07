import { Text, View, StyleSheet, Image, Modal } from "react-native";
import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";
import lazyfair from "musicmap/assets/lazyfair.jpg";
import { REACT_APP_BASE_URL } from "@env";
import { ImageViewer } from "musicmap/pages/Home/ImageViewer";
import { PastTripsList } from "musicmap/pages/PastTrips/PastTripMap/PastTripsList";

export function MapScreen() {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageToDisplay, setImageToDisplay] = useState("");

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
  const [images, setImages] = useState([]);
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

  // get images for the selected roadtrip
  const getImages = async (tripId) => {
    await axios
      .get(`${REACT_APP_BASE_URL}/images/get-trip-images/${tripId}`)
      .then((response) => {
        console.log("images: " + response.data); 
        setImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createImageViewer = (item) => {
    setImageViewerVisible(true);
    setImageToDisplay(item.imageURL);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  }

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
      <Modal
        animationType="slide"
        transparent={false}
        visible={imageViewerVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setImageViewerVisible(false);
        }}
      >
        <ImageViewer closeImageViewer={closeImageViewer} imageURL={imageToDisplay} />
      </Modal>
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
        {images.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              pinColor={"blue"}
            >
              <Callout
                onPress={() => {
                  createImageViewer(item);
                }}
              >
                <Image
                  style={{ alignSelf: "center", width: 50, height: 50 }}
                  source={{ uri: item.imageURL }}
                />
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <PastTripsList getSongs={getSongs} getImages={getImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
