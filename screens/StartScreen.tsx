import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

const StartScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Button
        mode="outlined"
        uppercase
        onPress={() => navigation.navigate("RecordingScreen")}
        textColor={"white"}
        style={styles.button}
      >
        Recording
      </Button>
      <Button
        mode="outlined"
        uppercase
        onPress={() => navigation.navigate("AudioListScreen")}
        textColor={"white"}
        style={styles.button}
      >
        Saved
      </Button>
      <Button
        mode="outlined"
        uppercase
        onPress={() => navigation.navigate("ProfileScreen")}
        textColor={"white"}
        style={styles.button}
      >
        Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    margin: 2,
    borderRadius: 0,
    width: 200,
  },
});

export default StartScreen;
