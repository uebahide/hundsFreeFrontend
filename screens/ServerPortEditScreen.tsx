import * as React from 'react';
import {useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import { Button, useTheme, TextInput, Text } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadPort } from '../utility/helpers';



const ServerPortEdit = ({navigation}) => {
  const theme = useTheme();
  const [port, setPort] = React.useState("");

  const updatePort = async () => {
    try {
      await AsyncStorage.setItem(
        'PORT', port
      ).
      then(() => {

        navigation.navigate("ProfileScreen")
      })

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const getPort = async () => {
      const port = await loadPort();
      setPort(port || "");
    };
    getPort();
  }, []);

  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} title="****" />
      <TextInput
        label="Port"
        value={port}
        onChangeText={text => setPort(text)}
      />
      <View style={{flex:1, alignItems:'center'}}>
        <Button
          icon="pencil"
          mode="outlined"
          uppercase
          onPress={() => updatePort()}
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


export default ServerPortEdit;