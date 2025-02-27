import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import RecordingScreen from "../screens/RecordingScreen";
import AudioListScreen from "../screens/AudioListScreen";
import EditScreen from "../screens/EditScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ServerIpEditScreen from "../screens/ServerIpEditScreen";
import QuestionScreen from "../screens/QuestionScreen";
import NameEditScreen from "../screens/NameEditScreen";
import LocationEditScreen from "../screens/LocationEditScreen";
import ServerPortEditScreen from "../screens/ServerPortEditScreen";


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ title: "Start" }}
        />
        <Stack.Screen
          name="RecordingScreen"
          component={RecordingScreen}
          options={{ title: "Recording" }}
        />
        <Stack.Screen
          name="EditScreen"
          component={EditScreen}
          options={{ title: "Edit" }}
        />
        <Stack.Screen
          name="AudioListScreen"
          component={AudioListScreen}
          options={{ title: "Audio List" }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{title: "Profile"}}
        />
        <Stack.Screen
          name="ServerIpEditScreen"
          component={ServerIpEditScreen}
          options={{title: "ServerIpEdit"}}
        />
        <Stack.Screen
          name="ServerPortEditScreen"
          component={ServerPortEditScreen}
          options={{title: "ServerPortEdit"}}
        />
        <Stack.Screen
          name="NameEditScreen"
          component={NameEditScreen}
          options={{title: "NameEdit"}}
        />
        <Stack.Screen
          name="LocationEditScreen"
          component={LocationEditScreen}
          options={{title: "LocationEdit"}}
        />
        <Stack.Screen
          name="QuestionScreen"
          component={QuestionScreen}
          options={{title: "Questions"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
