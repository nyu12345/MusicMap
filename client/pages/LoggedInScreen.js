import * as React from "react";
import { Text, View } from "react-native";
import { HomeScreen } from "musicmap/pages/Home/HomeScreen";
import { PastTripsScreen } from "musicmap/pages/PastTrips/PastTripsScreen";
import { MemoriesScreen } from "musicmap/pages/Memories/MemoriesScreen";
import { ProfileHomeScreen } from "musicmap/pages/Profile/ProfileHomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export function LoggedInScreen(props) {
  const loginToParent = () => {
    props.loginToParent();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Trips") {
            iconName = focused ? "ios-list-circle" : "ios-list-circle-outline";
          } else if (route.name === "Memories") {
            iconName = focused ? "eye-sharp" : "eye-outline";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "ios-person-circle-sharp"
              : "ios-person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Trips"
        component={PastTripsScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Memories"
        component={MemoriesScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        //component = {ProfileScreen}
        children={props => <ProfileHomeScreen navigation={props.navigation} loginToParent={loginToParent} />}
      />
    </Tab.Navigator>
  );
}
