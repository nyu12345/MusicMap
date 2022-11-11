import { Text, View, Image, StyleSheet, Pressable } from "react-native";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PastTrip = ({ name, startLocation, destination, startDate, endDate }) => {
  return (
    <Pressable
      onPress={()=>{console.log('selected roadtrip')}}
      style={styles.roadtripContainer}
    >
      <Image source={require('musicmap/assets/sample_pfp.png')} style={styles.image} />
      <View style={styles.roadtripContent}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.subTitle}>
            {dayjs(startDate).format('MM/DD/YY')} - {dayjs(endDate).format('MM/DD/YY')}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {startLocation}->{destination}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  roadtripContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  roadtripContent: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default PastTrip;