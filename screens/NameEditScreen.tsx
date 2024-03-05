import * as React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, useTheme, TextInput, Text } from "react-native-paper";
import { loadName } from '../utility/helpers';



const NameEditScreen = ({navigation}) => {
  const theme = useTheme();
  const [name, setName] = React.useState("");

  const updateName = async () => {
    try {
      await AsyncStorage.setItem(
        'NAME', name
      ).
      then(() => {

        navigation.navigate("ProfileScreen")
      })

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const getName = async () => {
      const port = await loadName();
      setName(port || "");
    };
    getName();
  }, []);

  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} title="****" />
      <TextInput
        label="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <View style={{flex:1, alignItems:'center'}}>
        <Button
          icon="pencil"
          mode="outlined"
          uppercase
          onPress={() => updateName()}
          textColor={"white"}
          style={styles.button}
        >
          Update
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
});


export default NameEditScreen;