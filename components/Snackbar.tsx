import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import {useTheme} from "react-native-paper";

const Snackbar = ({ message, isVisible, onDismiss }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 3000);
    } else {
      fadeAnim.setValue(0);
    }
  }, [isVisible, onDismiss, fadeAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
   snackbar: {
    width: "90%",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: '#7E61B6',
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  text: {
    color: "white",
  },
});

export default Snackbar;
