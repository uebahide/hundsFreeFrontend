import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useTheme } from "react-native-paper";
import SwipeableListItem from "../components/SwipeableListItem";
import { io } from "socket.io-client";
import { getServerUrl } from "../utility/helpers";

const AudioListScreen = ({ navigation }) => {
  const [localAudios, setLocalAudios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const loadLocalAudios = async () => {
      try {
        const savedAudios = await AsyncStorage.getItem("localAudios");
        if (savedAudios !== null) {
          setLocalAudios(JSON.parse(savedAudios));
        }
      } catch (e) {
        console.error("Error loading local audios:", e);
      }
    };

    loadLocalAudios();
  }, []);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const serverUrl = await getServerUrl();
      const socketConnection = io(serverUrl);

      socketConnection.on("file_saved", (data) => {
        console.log("File saved on server:", data);
        const responseData = data.data;

        if (
          responseData &&
          typeof responseData === "object" &&
          "hun" in responseData &&
          "eng" in responseData
        ) {
          navigation.navigate("EditScreen", {
            responseData: {
              hun: responseData.hun,
              eng: responseData.eng,
            },
            navigateTo: "AudioListScreen",
          });
        }
      });

        return () => {
          socketConnection.disconnect();
        };
      } catch (error) {
        console.log("Error in fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteAudio = async (audioUri) => {
    try {
      await FileSystem.deleteAsync(audioUri, { idempotent: true });
      console.log(`Deleted audio file: ${audioUri}`);

      // Update local state to remove the deleted file from the list
      const updatedAudios = localAudios.filter((uri) => uri !== audioUri);
      setLocalAudios(updatedAudios);

      // Update AsyncStorage
      await AsyncStorage.setItem("localAudios", JSON.stringify(updatedAudios));
    } catch (error) {
      console.error(`Error deleting audio file: ${error}`);
      alert("Error deleting the file.");
    }
  };

  const handleSendAudio = async (audioUri) => {
    console.log(audioUri);

    setIsLoading(true);

    let audioData = new FormData();

    // Use the full path including the directory
    const fullPath = `${FileSystem.documentDirectory}audio/${audioUri
      .split("/")
      .pop()}`;
    console.log("Full Path: ", fullPath);

    audioData.append("file", {
      uri: fullPath,
      type: "audio/wav",
      name: fullPath.split("/").pop(),
    });

    try {
      const serverUrl = await getServerUrl()
      const response = await fetch(`${serverUrl}/send-data`, {
        method: "POST",
        body: audioData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Audio sent successfully, server response:", responseData);
      console.log("RESPONSEDATA ", responseData);
    } catch (e) {
      console.error("Error sending audio:", e);
      alert("Couldn't reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const logAudioFiles = () => {
    console.log("List of Audio Files:", localAudios);
  };

  return (
    <View style={styles.container}>
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
            style={styles.loading}
          />
          <Text style={{ color: "white" }}>
            Evaluating data. It can take some time...
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            data={localAudios}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <SwipeableListItem
                item={item.split("/").pop()}
                onDelete={() => handleDeleteAudio(item)}
                onSend={() => handleSendAudio(item)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    loading: {
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors.primary,
      color: "white",
    },
    audioItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sendButton: {
      backgroundColor: "blue",
      color: "white",
      padding: 5,
    },
    playButton: {
      backgroundColor: "green",
      color: "white",
      padding: 5,
      marginRight: 10,
    },
    deleteButton: {
      backgroundColor: "red",
      color: "white",
      padding: 5,
    },
    filenameText: {
      color: "white",
    },
    logButton: {
      backgroundColor: "blue",
      padding: 10,
      margin: 10,
      borderRadius: 5,
    },
    logButtonText: {
      color: "white",
      textAlign: "center",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    loadingText: {
      color: "white",
      marginTop: 10, // Add some space between the ActivityIndicator and the Text
    },
  });

export default AudioListScreen;
