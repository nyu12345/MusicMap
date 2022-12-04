import { Pressable, StyleSheet, Image, Text, View } from "react-native";
import * as React from "react"; 

const MemoryCard = ({ roadtripData }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => {console.log("open collage")}}>
        <Image source={{ uri: roadtripData.coverImage }} style={styles.image} />
        <Text style={styles.title} >{roadtripData.name}</Text>
      </Pressable>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    //flex: 1, 
  }, 
  image: {
    //flex: 1, 
    position: "relative", 
    alignSelf: "center", 
    borderRadius: 10, 
    width: "85%", 
    height: 400, 
  },
  title: {
    position: "absolute",
    left: 40, 
    top: 50, 
    fontSize: 40, 
    color: "white", 
    fontWeight: "bold", 
    flexWrap: "wrap", 
  }, 

});

export default React.memo(MemoryCard); 