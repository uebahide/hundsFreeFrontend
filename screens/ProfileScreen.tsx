import * as React from 'react';
import {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Menu } from 'react-native-paper';
import { Button, useTheme } from "react-native-paper";
import { loadServerIP, loadPort, loadName, loadLocation } from '../utility/helpers';



const ProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const [ipAddress, setIpAddress] = useState("")
  const [port, setPort] = useState("")
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")

  //Read the ipAddress, port, name, and location stored at mount time
  useFocusEffect(() => {
    const loadIP = async () => {
      const ipAddress = await loadServerIP();
      const port = await loadPort();
      const name = await loadName();
      const location = await loadLocation();
      setIpAddress(ipAddress || "");
      setPort(port || "");
      setName(name || "");
      setLocation(location || "");
    };
    loadIP();
  });

  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} onPress={() => navigation.navigate("ServerIpEditScreen")} title={`Server IP: ${ipAddress}`}/>
      <Menu.Item titleStyle={{ color: 'white' }} onPress={() => navigation.navigate("ServerPortEditScreen")} title={`Server Port: ${port}`} />
      <Menu.Item titleStyle={{ color: 'white' }} onPress={() => navigation.navigate("NameEditScreen")} title={`Name: ${name}`}/>
      <Menu.Item titleStyle={{ color: 'white' }} onPress={() => navigation.navigate("LocationEditScreen")} title={`Location: ${location}`} />
    </View>
  )
}

const styles = StyleSheet.create({

  button: {
    margin: 2,
    borderRadius: 0,
    width: 200,
  },
});


export default ProfileScreen;