import React from "react";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import io from "socket.io-client";
import AppNavigator from "./components/AppNavigator";
import { getServerUrl } from "./utility/helpers";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#262129",
    secondary: "#a888e6",
    accent: "yellow",
  },
};

const App = () => {
  useEffect(() => {
    const socket = io("serverUrl", {
      transports: ["websocket"],
    });
    
    socket.on("connect", () => {
      console.log("connected to socket server");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;
