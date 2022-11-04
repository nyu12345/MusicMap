import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./HomeStyles";
import React, { useState, useEffect } from "react";
import { Text, Image } from "react-native";
import * as Location from "expo-location";

export function HomeMap() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionStatus, setStatus] = useState(null);

  // map size parameters
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = 0.0421;

  /**
   * requests permission if needed
   */
  useEffect(() => {
    (async () => {
      permission = await Location.requestForegroundPermissionsAsync();
      setStatus(permission)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (permissionStatus == null) return;
      if (!permissionStatus.granted) {
          console.log("Permission to access location was denied");
          return;
        } else {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            timeInterval: 0,
            distanceInterval: 0,
          });
          if (location) {
            updateLocation(location);
          }
        }
    })()
  });

  /**
   * update's the current location of the user
   * @param {Location.LocationObject} newLocation the new location
   */
  const updateLocation = (newLocation) => {
    setCurrentLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {currentLocation ? (
          <Marker
            coordinate = {{ 
              latitude: currentLocation.latitude, 
              longitude: currentLocation.longitude 
            }}
            >
            <Callout>
              <Image style={{ alignSelf: 'center', width: 50, height: 50 }}
                  source={require('musicmap/assets/lazyfair.jpg')} />
              <Text style={{ textAlign: 'center' }}>Sour Patch Kids</Text>
              <Text style={{ textAlign: 'center' }}>Bryce Vine</Text>
            </Callout>
          </Marker>
        )
        : null}
      </MapView>
      <Text style={styles.modalText}>{
        currentLocation
        ? `coords: (${currentLocation.latitude}, ${currentLocation.longitude})`
        : "Retrieving your location..."
      }</Text>
    </>
  );
}
