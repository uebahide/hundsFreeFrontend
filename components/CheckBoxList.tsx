import React, {useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

// label list (import from assets/labels.json)

const CheckboxList = ({checkedLabels, toggleCheckbox, labels}) => {

  return (
    <View style={styles.container}>
      {labels.map((q) => (
        <View key={q.id} style={styles.checkboxContainer}>
          <Text style={styles.label}>{q.label}</Text>
          <Checkbox
            status={checkedLabels[q.label] ? "checked" : "unchecked"}
            onPress={() => toggleCheckbox(q.label)}
            color="green"
            uncheckedColor="white"
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  checkboxContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10,
  },
  label: {
    color:"white",
    fontSize: 18,
    marginLeft: 8, 
  },
});

export default CheckboxList;
