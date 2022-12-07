import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ReceivedScreen } from "musicmap/pages/Profile/ReceivedScreen";
import { SentScreen } from "musicmap/pages/Profile/SentScreen";
import { Dimensions } from "react-native";

const Tab = createMaterialTopTabNavigator();

export function FriendRequestsScreen(props) {
  const loginToParent = () => {
    props.loginToParent();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressOpacity: 1,
        tabBarInactiveTintColor: "#000000",
        tabBarActiveTintColor: "#ffffff",
        tabBarContentContainerStyle: {
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#5A5A5A",
          height: 30,
          borderRadius: 30,
          top: 9,
          width: 100,
          left: (Dimensions.get("window").width / 2 - 100) / 2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          width: "auto",
          backgroundColor: "#f2f2f2",
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen name="Received" component={ReceivedScreen} />
      <Tab.Screen name="Sent" component={SentScreen} />
    </Tab.Navigator>
  );
}
