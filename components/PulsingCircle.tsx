import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const PulsingCircle = ({ isRecording }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [pulseAnims, setPulseAnims] = useState<any>([]);

  useEffect(() => {
    if (isRecording) {
      const newPulseAnims = [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ];
      setPulseAnims(newPulseAnims);

      newPulseAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              delay: index * 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      // Reset animations when recording stops
      pulseAnims.forEach((anim) => {
        anim.stopAnimation();
        anim.setValue(0);
      });
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name="microphone" size={70} color="#fff" />
      </View>
      {isRecording &&
        pulseAnims.map((anim, index) => (
          <Animated.View
            key={`pulse_${index}`}
            style={[
              styles.pulseRing,
              {
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5 + index * 0.2],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.6, 0.3, 0],
                }),
              },
            ]}
          />
        ))}
    </View>
  );
};
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    iconContainer: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    pulseRing: {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: 70,
      borderWidth: 2,
      borderColor: theme.colors.secondary,
      backgroundColor: "transparent",
    },
  });

export default PulsingCircle;
