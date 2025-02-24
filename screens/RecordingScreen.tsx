import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import { io } from "socket.io-client";
import Snackbar from "../components/Snackbar";
import {
  createFilename,
  ensureDirectoryExists,
  formatTime,
  getLocation,
  getName,
  listAudioFiles,
  loadLocation,
  loadName,
  loadPort,
  saveAudioLocally,
} from "../utility/helpers";
import { useTheme } from "react-native-paper";
import PulsingCircle from "../components/PulsingCircle";
import {getServerUrl} from "../utility/helpers";


const RecordingScreen = ({ navigation, route }) => {
  const [responseMessage, setResponseMessage] = useState<string | null>("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [serverUrlPromise, setServerUrlPromise] = useState<Promise<string> | null>(null);

  useEffect(() => {
    const initializeServerUrl = async () => {
      const url = await getServerUrl();
      setServerUrlPromise(Promise.resolve(url));
    };
    initializeServerUrl();
  }, []);

  const theme = useTheme();
  const dynamicStyles = getStyles(theme);

  useEffect(() => {
    // Check the initial network state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      setSnackbarMessage(state.isConnected ? "Connected" : "Not connected");
      setIsSnackbarVisible(true);
      console.log(`Initial network state: ${state.isConnected}`);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setSnackbarMessage(state.isConnected ? "Reconnected" : "Disconnected");
      setIsSnackbarVisible(true);
      console.log(`Network state changed: ${state.isConnected}`);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getServerUrl().then(url => {
      const socketConnection = io(url);
  
      // socketConnection.on("file_saved", (data) => {
      //   console.log("File saved on server:", data);
      //   const responseData = data.data;
  
      //   if (
      //     responseData &&
      //     typeof responseData === "object" &&
      //     "hun" in responseData &&
      //     "eng" in responseData
      //   ) {
      //     navigation.navigate("EditScreen", {
      //       responseData: {
      //         hun: responseData.hun,
      //         eng: responseData.eng,
      //       },
      //       navigateTo: "RecordingScreen",
      //     });
      //   }
      // });
  
      return () => {
        socketConnection.disconnect();
      };
    }).catch(error => {
      console.error("Error while resolving serverUrl:", error);
    });
  }, []);
  

  const fetchData = async (audioUri: string) => {
    if (!isConnected) {
      console.log("Not connected to the internet. Saving audio file locally.");
      saveAudioLocally(audioUri);
      return;
    }

    setIsLoading(true);
    const directory = `${FileSystem.documentDirectory}audio/`;
    const dirInfo = await FileSystem.getInfoAsync(directory);

    const audioFiles = await listAudioFiles();

    // Delete all existing audio files in the directory
    try {
      await Promise.all(
        audioFiles.map(async (filename) => {
          const filePath = `${directory}${filename}`;
          await FileSystem.deleteAsync(filePath, { idempotent: true });
        })
      );
      console.log("All existing audio files deleted.");
    } catch (error) {
      console.error("Error deleting existing audio files:", error);
    }

    const filename = await createFilename();


    // Move the recorded audio file to the device's file system
    if (!dirInfo.exists) {
      console.log("Directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    const newUri = `${directory}${filename}`;
    await FileSystem.moveAsync({ from: audioUri, to: newUri });

    // Now, `newUri` contains the path to the saved audio file on the device
    console.log("Saved audio file path:", newUri);

    await listAudioFiles();

    let audioData = new FormData();
    audioData.append("file", {
      uri: newUri,
      type: "audio/wav",
      name: filename,
    } as any);

    try {
      const url = await serverUrlPromise;
      const response = await fetch(`${url}/send-data`, {
        method: "POST",
        body: audioData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      const responseMessageData = responseData.message;
      setResponseMessage(responseMessageData);
      console.log("responseData ");
      console.log(responseData);

      await FileSystem.deleteAsync(audioUri, { idempotent: true });
      console.log("Local audio file deleted after successful upload.");

      setIsLoading(false);


      navigation.navigate("EditScreen", {
        responseData: {
          hun: responseData.hun,
          eng: responseData.eng,
        },
        navigateTo: "RecordingScreen",
      });
    } catch (e) {
      console.log("Error fetching data:", e);
      saveAudioLocally(audioUri);

      alert("Couldn't reach the server. Audio saved locally.");
      setIsLoading(false);
    }
  };
  const handleSnackbarDismiss = () => {
    setIsSnackbarVisible(false);
  };

  async function startRecording() {
    if (isRecording) {
      await stopRecording();
    }

    setIsRecording(true);

    try {
      console.log("Requesting permissions..");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return;

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();

      setRecording(newRecording);
    } catch (error) {
      console.error("Failed to start recording", error);
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) {
      console.error("No recording to stop");
      return;
    }

    await recording.stopAndUnloadAsync();
    setRecording(null);
    setIsRecording(false);

    const uri = recording.getURI();
    console.log("uri ", uri);

    if (uri) {
      const filename = await createFilename();
      console.log("FILENAME ", filename);

      const newUri = `${FileSystem.documentDirectory}${filename}`;

      try {
        await FileSystem.moveAsync({ from: uri, to: newUri });
        console.log("Audio file saved as:", newUri);

        // Check network connectivity
        if (!isConnected) {
          // Save the audio locally if there's no internet connection
          saveAudioLocally(newUri);
          alert("No internet connection. Audio saved locally.");
        } else {
          // If connected, proceed with sending the data
          fetchData(newUri);
        }
      } catch (error) {
        console.error("Error renaming audio file:", error);
      }
    } else {
      console.error("Recording failed or was not saved correctly.");
    }

    resetRecordingState();
  }

  function resetRecordingState() {
    setRecording(null);
    setIsRecording(false);
    setRecordTime(0);
  }

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(
        () => setRecordTime((prevTime) => prevTime + 1),
        1000
      );
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    // Check for messages passed through navigation
    if (route.params?.message) {
      setSnackbarMessage(route.params.message);
      setIsSnackbarVisible(true);
    }
  }, [route.params]);

  return (
    <View style={dynamicStyles.container}>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.secondary}
            style={dynamicStyles.loading}
          />
          <Text style={{ color: "white" }}>
            Evaluating data. It can take some time...
          </Text>
        </View>
      ) : (
        <View style={dynamicStyles.content}>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
          >
            <PulsingCircle isRecording={isRecording} />
          </TouchableOpacity>
          <Text style={dynamicStyles.recordTime}>
            {isRecording ? formatTime(recordTime) : "0:00"}
          </Text>
        </View>
      )}
      {isSnackbarVisible && (
        <Snackbar
          message={snackbarMessage}
          isVisible={isSnackbarVisible}
          onDismiss={handleSnackbarDismiss}
        />
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    content: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: 72,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
    },
    recordTime: {
      fontSize: 18,
      color: "#ffffff",
      textTransform: "uppercase",
    },
    loadingText: {
      color: "white",
      marginTop: 10, // Add some space between the ActivityIndicator and the Text
    },
    loading: {
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default RecordingScreen;
