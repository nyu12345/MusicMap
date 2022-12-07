import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ExpoConstants from "expo-constants";
import { ProfileScreen } from "musicmap/pages/Profile/ProfileScreen";
import { FriendRequestsScreen } from "musicmap/pages/Profile/FriendRequestsScreen";
import { SentScreen } from "musicmap/pages/Profile/SentScreen";

const Tab = createMaterialTopTabNavigator();

export function ProfileHomeScreen(props) {
  const loginToParent = () => {
    props.loginToParent();
  };

  return (
    <Tab.Navigator style={{ marginTop: ExpoConstants.statusBarHeight }}>
      <Tab.Screen
        name="Your Profile"
        children={(props) => (
          <ProfileScreen
            navigation={props.navigation}
            loginToParent={loginToParent}
          />
        )}
      />
      <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
    </Tab.Navigator>
  );
}
