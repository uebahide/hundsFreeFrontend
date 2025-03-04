import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, useTheme, Checkbox, Text} from "react-native-paper";
import { getServerUrl, loadLocation, loadName } from "../utility/helpers";



const EditScreen = ({ route, navigation }) => {

  const [originalHunText, setOriginalHunText] = useState(
    route.params.responseData.hun
  );
  const [originalEngText, setOriginalEngText] = useState(
    route.params.responseData.eng
  );

  const [hunText, setHunText] = useState(route.params.responseData.hun);
  const [engText, setEngText] = useState(route.params.responseData.eng);

  const theme = useTheme();
  const styles = getStyles(theme);

  const handleSave = async () => {
      
    const payload = {
      originalHun: originalHunText,
      originalEng: originalEngText,
      editedHun: hunText,
      editedEng: engText,
      name: await loadName(),
      location: await loadLocation(),
    };
    
    navigation.navigate("QuestionScreen", {payload})
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.textfieldContainer}>
            <TextInput
              style={[styles.input]}
              value={hunText}
              onChangeText={setHunText}
              multiline
            />
            <TextInput
              style={[styles.input]}
              value={engText}
              onChangeText={setEngText}
              multiline
            />
          </View>
          <Button
            style={styles.button}
            onPress={handleSave}
            mode="outlined"
            uppercase
            textColor={"white"}
          >
            Save
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors.primary,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    textfieldContainer: {
      width: "100%",
      flex: 1,
      justifyContent: "space-around",
    },
    input: {
      borderWidth: 1,
      borderColor: "gray",
      padding: 10,
      borderRadius: 5,
      color: "white",
      height: "45%",
      textAlignVertical: "top",
    },
    button: {
      margin: 32,
      borderRadius: 0,
      width: 200,
      alignSelf: "center",
    },
  });

export default EditScreen;
