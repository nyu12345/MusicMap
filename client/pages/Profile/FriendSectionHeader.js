import { View, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 

export const FriendSectionHeader = ({ bottomSheetModalRef }) => {

  const openModal = () => {
    bottomSheetModalRef.current.present();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.row}>
        <Text style={styles.name}>Friends</Text>
        <Pressable>
          <AntDesign name="plus" size={24} color="black" onPress={openModal}/>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 20, 
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});