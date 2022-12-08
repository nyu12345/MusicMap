import { Pressable, StyleSheet, Image, Text, View } from "react-native";
import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";

const MemoryCard = ({ roadtripData, setModalVisible, setCurrentRoadtrip }) => {
  if (roadtripData == null) roadtripData = {};
  const coverImageURI =
    "images" in roadtripData && roadtripData.images.length > 0
      ? { uri: roadtripData.images[0].imageURL }
      : require("musicmap/assets/sample_roadtrip.jpg");
  return (
    <Pressable
      onPress={() => {
        setModalVisible(true);
        setCurrentRoadtrip(roadtripData);
      }}
      style={styles.container}
    >
      <Image source={coverImageURI} style={styles.image} />
      <View style={styles.overlaidText}>
        <Text style={styles.title}>{roadtripData.name}</Text>
        <Text style={styles.subtitle}>
          {roadtripData.startLocation} -> {roadtripData.destination}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    height: 400,
  },
  image: {
    borderRadius: 10,
    width: "85%",
    height: "100%",
  },
  overlaidText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    flex: 1,
    fontSize: 33,
    color: "white",
    fontWeight: "bold",
    flexWrap: "wrap", // don't think wrap works
  },
  subtitle: {
    fontSize: 15,
    color: "white",
    flexWrap: "wrap", // don't think wrap works
  },
});

export default React.memo(MemoryCard);
