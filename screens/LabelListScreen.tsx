import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import SwipeableListItem from "../components/SwipeableListItem";
import { loadLabels } from "../utility/helpers";
import { useFocusEffect } from "@react-navigation/native";

const LabelListScreen = ({navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [labels, setLabels] = useState([])

  useFocusEffect(() => {
    const loadLabelsWithHelper = async () => {
      try{
        const labels_json = await loadLabels();
        setLabels(labels_json)
      }catch(error){
        console.error(error)
      }
    }

    loadLabelsWithHelper();
  })

  const handleDeleteList = (item) => {

  }

  return (
    <View style={styles.container}>
        <View>
          <FlatList
            data={labels}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SwipeableListItem
                item={item.label}
                onDelete={() => handleDeleteList(item)}
                onSend={() => null}
                isLabelList = {true}
              />
            )}
          />
          <Button
            mode="outlined"
            uppercase
            onPress={() => navigation.navigate("AddLabelScreen")}
            textColor={"white"}
            style={styles.button}
          >
            Add new label
          </Button>
        </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    loading: {
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      padding: 10,
      paddingBottom: 100, //this is required to show ADD button under flat list
      backgroundColor: theme.colors.primary,
      color: "white",
    },
    audioItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sendButton: {
      backgroundColor: "blue",
      color: "white",
      padding: 5,
    },
    playButton: {
      backgroundColor: "green",
      color: "white",
      padding: 5,
      marginRight: 10,
    },
    deleteButton: {
      backgroundColor: "red",
      color: "white",
      padding: 5,
    },
    filenameText: {
      color: "white",
    },
    logButton: {
      backgroundColor: "blue",
      padding: 10,
      margin: 10,
      borderRadius: 5,
    },
    logButtonText: {
      color: "white",
      textAlign: "center",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    loadingText: {
      color: "white",
      marginTop: 10, // Add some space between the ActivityIndicator and the Text
    },
    button: {
      margin: 32,
      borderRadius: 0,
      width: 200,
      alignSelf: "center",
    },
  });



export default LabelListScreen