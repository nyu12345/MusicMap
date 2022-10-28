import MapView from "react-native-maps";
import styles from "./HomeStyles";
import Geolocation from "react-native-geolocation-service";

export function HomeMap() {
  const location = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={location}
      showsUserLocation={true}
    ></MapView>
  );
}
