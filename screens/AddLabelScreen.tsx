import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, useTheme, TextInput, Text, Menu } from "react-native-paper";
import { addLabel, loadLabels } from "../utility/helpers";
import * as FileSystem from 'expo-file-system';
import LabelListScreen from "./LabelListScreen";

const AddLabelScreen = ({navigation}) => {
  const theme = useTheme();
  const [name, setName] = useState("");

  const addLabelWithHelper = async (label) => {
    try{
      await addLabel(label)
    }catch(error){
      console.log(error)
    }

    navigation.navigate(LabelListScreen)
  }

  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} title="****" />
      <TextInput
        label="Label name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <View style={{flex:1, alignItems:'center'}}>
        <Button
          // icon="pencil"
          mode="outlined"
          uppercase
          onPress={() => addLabelWithHelper({ id: Date.now().toString(), label: name })}
          textColor={"white"}
          style={styles.button}
        >
          Add Label
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 2,
    borderRadius: 0,
    width: 150,
  },
})

export default AddLabelScreen