import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { Button, useTheme, Checkbox, Text} from "react-native-paper";
import { getServerUrl, loadLabels, loadLocation, loadName } from "../utility/helpers";
import CheckboxList from "../components/CheckBoxList";



const EditScreen = ({ route, navigation }) => {
  //manage labels
  const [labels, setLabels] = useState([]);
  //get labels by using helper function
  useEffect(() => {
    const labels = loadLabels(); // no need `await`
    setLabels(labels);
  }, []);
  
  // manage checked state
  const [checkedLabels, setcheckedLabels] = useState(
    labels.reduce((acc, q) => ({ ...acc, [q.label]: false }), {})
  );

  // toggel checked state
  const toggleCheckbox = (label) => {
    setcheckedLabels((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const [hunHeight, setHunHeight] = useState(40); 
  const [engHeight, setEngHeight] = useState(40); 
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
    try {
      const url = await getServerUrl();
      const selectedLabels = Object.keys(checkedLabels).filter((key) => checkedLabels[key])

      const payload = {
        originalHun: originalHunText,
        originalEng: originalEngText,
        editedHun: hunText,
        editedEng: engText,
        name: await loadName(),
        location: await loadLocation(),
        labels: selectedLabels
      };

      const response = await fetch(`${url}/submit-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigation.navigate(route.params.navigateTo, {
          message: "Data sent successfully",
        });
      } else {
        throw new Error("Failed to submit edited data");
      }
    } catch (error) {
      console.log("hello")
      console.error("Error submitting edited data:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.container}>
          <View style={styles.textfieldContainer}>
            <TextInput
              style={[styles.input, {height: hunHeight}]}
              value={hunText}
              onChangeText={setHunText}
              multiline
              onContentSizeChange={(event) => 
                setHunHeight(event.nativeEvent.contentSize.height)
              }
            />
            <TextInput
              style={[styles.input, {height: engHeight}]}
              value={engText}
              onChangeText={setEngText}
              multiline
              onContentSizeChange={(event) => 
                setEngHeight(event.nativeEvent.contentSize.height)
              }
            />
          </View>
          <CheckboxList labels={labels} checkedLabels={checkedLabels} toggleCheckbox={toggleCheckbox}/>
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
        </ScrollView>
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
