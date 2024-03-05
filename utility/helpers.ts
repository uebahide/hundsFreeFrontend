import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createFilename() {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}_${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}_${currentDate.getDate().toString().padStart(2, "0")}`;
  const formattedTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}_${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}_${currentDate.getSeconds().toString().padStart(2, "0")}`;

  const name = await loadName();
  const location = await loadLocation();
  return `audio_${name}_${location}_${formattedDate}_${formattedTime}.wav`;
}

export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export async function ensureDirectoryExists() {
  const directory = `${FileSystem.documentDirectory}`;

  // Check if directory exists
  const info = await FileSystem.getInfoAsync(directory);
  if (!info.exists) {
    console.log("Directory does not exist, creating...");
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  } else if (!info.isDirectory) {
    console.error("Expected a directory but found a file!");
  } else {
    console.log("Directory already exists!");
  }
}

export const saveAudioLocally = async (audioUri) => {
  try {
    const localAudiosString = await AsyncStorage.getItem("localAudios");
    const localAudios = localAudiosString ? JSON.parse(localAudiosString) : [];

    console.log("localAudios", localAudios);

    const updatedAudios = [...localAudios, audioUri];
    await AsyncStorage.setItem("localAudios", JSON.stringify(updatedAudios));
    console.log("Audio saved locally");
  } catch (error) {
    console.error("Error saving audio locally:", error);
  }
};

export const listAudioFiles = async (): Promise<string[]> => {
  const directory = `${FileSystem.documentDirectory}`;
  console.log('directory ', directory);
  
  try {
    const files = await FileSystem.readDirectoryAsync(directory);
    console.log("Audio files in the directory:", files);
    return files;
  } catch (error) {
    console.error("Error listing audio files:", error);
    return [];
  }
};

export const loadServerIP = async () => {
  try {
    const ipAddress = await AsyncStorage.getItem('SERVER_IP');
    if (ipAddress !== null) {
      // IPアドレスが保存されている場合は使用する
      return ipAddress;
    }
    return "";
  } catch (error) {
    console.error('Got error during getting the ip address:', error);
  }
};

export const loadPort = async () => {
  try {
    const port = await AsyncStorage.getItem('PORT');
    if (port !== null) {
      // IPアドレスが保存されている場合は使用する
      return port;
    }
    return "";
  } catch (error) {
    console.error('Got error during getting the server port:', error);
  }
};

export const loadName = async () => {
  try {
    const name = await AsyncStorage.getItem('NAME');
    if (name !== null) {
      // IPアドレスが保存されている場合は使用する
      return name;
    }
    return "";
  } catch (error) {
    console.error('Got error during getting the server port:', error);
  }
};

  export const loadLocation = async () => {
    try {
      const location = await AsyncStorage.getItem('LOCATION');
      if (location !== null) {
        // IPアドレスが保存されている場合は使用する
        return location;
      }
      return "";
    } catch (error) {
      console.error('Got error during getting the server port:', error);
    }
  };

export async function getServerUrl(){
  const SERVER_IP = await loadServerIP();
  const SERVER_PORT = await loadPort();
  return `http://${SERVER_IP}:${SERVER_PORT}`
}

export async function getName(){
  const name = await loadName();
  return name;
}
export async function getLocation(){
  const location = await loadLocation();
  return location;
}
