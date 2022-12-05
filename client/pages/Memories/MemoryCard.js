import { Pressable, StyleSheet, Image, Text, View } from "react-native";
import * as React from "react"; 

const MemoryCard = ({ roadtripData }) => {
  return (
    <Pressable onPress={() => {console.log("open collage")}} style={styles.container} >
      <Image source={{uri: roadtripData.coverImage}} style={styles.image}/>
      <View style={styles.overlaidText}>
        <Text style={styles.title}>{roadtripData.name}</Text>
        <Text style={styles.subtitle}>{roadtripData.startLocation} -> {roadtripData.destination}</Text>
      </View>
    </Pressable>
  ); 
}

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
  }, 
  subtitle: {
    fontSize: 15, 
    color: "white", 
    flexWrap: "wrap", 
  }
});

export default React.memo(MemoryCard); 