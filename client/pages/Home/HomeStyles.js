import { StyleSheet, Dimensions } from "react-native";

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16); //calculate with aspect ratio
const imageWidth = dimensions.width;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addImageButton: {
    alignSelf: 'flex-end',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "aliceblue",
    position: "absolute",
    right: 20,
    top: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  homeMap: {
    position: "absolute",
    zIndex: -3
  },
  addFriendsButton: {
    alignSelf: 'flex-end',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "aliceblue",
    position: "absolute",
    right: 20,
    top: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  startButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
  },
  bottomSheetRoadtripFriends: {
    position: "absolute",
    zIndex: 1
  },
  roadtripHeader: {
    alignItems: "center",
    backgroundColor: "white",
    width: "70%",
    borderRadius: 30,
    position: "relative",
    top: imageHeight - 20,
    height: 150,
    zIndex: -1
  },
  roadtripButtonContainer: {
    position: "absolute",
    width: "70%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    top: 90
  },
  songHeader: {
    bottom: 100,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  songTexts: {
    position: "relative",
    right: 30
  },
  songTitle: {
    position: "absolute",
    width: 160,
    fontSize: 15,
    fontWeight: "bold",
    bottom: 4,
  },
  songArtist: {
    position: "absolute",
    width: 160,
    fontSize: 15,
  },
  songImage: {
    position: "absolute",
    height: 60,
    width: 60,
    right: 40

  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 4,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "black",
    width: 100,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 4,
    borderColor: "black",
    borderWidth: 1,
    elevation: 3,
    backgroundColor: "white",
    width: 100,
  },
  formButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    position: "centered",
    color: "black",
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 75,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  whiteBoldTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  blackBoldTextStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTextInput: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default styles;
