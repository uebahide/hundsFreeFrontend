import * as React from 'react';
import { useEffect} from 'react';
import { View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu } from 'react-native-paper';
import { Button, useTheme, TextInput, Text } from "react-native-paper";
import { loadServerIP } from '../utility/helpers';



const ServerIpEditScreen = ({navigation}) => {
  const theme = useTheme();
  const [ipAddress, setIpAddress] = React.useState("");

  const updateServerIp = async () => {
    try {
      await AsyncStorage.setItem(
        'SERVER_IP', ipAddress
      );

      navigation.navigate("ProfileScreen")
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const loadIP = async () => {
      const ipAddress = await loadServerIP();
      setIpAddress(ipAddress || "");
    };
    loadIP();
  }, []);
  

  return (
    <View style={[{ backgroundColor: theme.colors.primary , flex: 1,}]}>
      <Menu.Item titleStyle={{ color: 'white' }} title="****" />
      <TextInput
        label="Server IP"
        value={ipAddress}
        onChangeText={text => setIpAddress(text)}
      />
      <View style={{flex:1, alignItems:'center'}}>
        <Button
          icon="pencil"
          mode="outlined"
          uppercase
          onPress={() => updateServerIp()}
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


export default ServerIpEditScreen;