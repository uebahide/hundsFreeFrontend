import React from "react";
import { ViewStyle } from "react-native";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SwipeableListItem = ({ item, onDelete, onSend }) => {
  const renderRightActions = (dragX) => {
    const transDelete = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [140, -6800],
      extrapolateRight: "clamp",
    });
    const transUpdate = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [82, -4000],
      extrapolateRight: "clamp",
    });

    const deleteTransition = {
      transform: [{ translateX: transDelete}],
    };
    const updateTransition = {
      transform: [{ translateX: transUpdate}],
    };

    return (
      <View style={[styles.rightActions]}>
        <Animated.View
          style={[
            styles.actionItem,
            deleteTransition,
            { backgroundColor: "#f2534c" },
          ]}
        >
          <TouchableOpacity onPress={onDelete}>
            <FontAwesome name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.actionItem,
            updateTransition,
            { backgroundColor: "#a888e6"},
          ]}
      >
          <TouchableOpacity onPress={onSend}>
            <FontAwesome name="upload" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swipeable
        renderRightActions={renderRightActions}
        leftThreshold={10000}
        rightThreshold={0}>
        <View style={styles.listItem}>
          <Text style={styles.fileName}>{item}</Text>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 17,
    borderBottomWidth: 1,
    borderColor: "#ececec",
  },
  fileName: {
    color: "#ececec",
  },
  rightActions: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
  actionItem: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  actionText: {
    backgroundColor: "#f2534c",
  },
});

export default SwipeableListItem;