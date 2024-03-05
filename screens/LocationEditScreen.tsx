import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { Menu } from 'react-native-paper';
import { Button, useTheme, TextInput, Text } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadLocation } from '../utility/helpers';


const LocationEditScreen = ({navigation}) => {
  const theme = useTheme();
  const [location, setLocation] = React.useState("");

  const updateLocation = async () => {
    try {
      await AsyncStorage.setItem(
        'LOCATION', location
      ).
      then(() => {

        navigation.navigate("ProfileScreen")
      })

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const port = await loadLocation();
      setLocation(port || "");
    };
    getLocation();
  }, []);


  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} title="****" />
      <TextInput
        label="Location"
        value={location}
        onChangeText={text => setLocation(text)}
      />
      <View style={{flex:1, alignItems:'center'}}>
        <Button
          icon="pencil"
          mode="outlined"
          uppercase
          onPress={() => updateLocation()}
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


export default LocationEditScreen;