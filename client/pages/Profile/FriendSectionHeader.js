import { View, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 

/**
 * 
 * @param {bottom sheet modal property} bottomSheetModalref
 * @returns the section header for friends that has the + button
 * to enable the user to add friends
 */
export const FriendSectionHeader = ({ bottomSheetModalRef }) => {

  /**
   * opens the bottomsheet
   */
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