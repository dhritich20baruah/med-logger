import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

export default function CameraFunction({ userId }) {
  let user_Id = userId;
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibPermit, setHasMediaLibPermit] = useState();
  const [photo, setPhoto] = useState();

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibPermit(mediaLibraryPermission.status === "granted");
    })();

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS gallery (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, date TEXT, uri TEXT)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM gallery WHERE user_id = ?",
        [user_Id],
        (txObj, resultSet) => {},
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permission....</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let savePhoto = async () => {
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      let dateString = new Date().toISOString();
      let date = dateString
        .slice(0, dateString.indexOf("T"))
        .split("-")
        .reverse()
        .join("-");
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO gallery (user_id, date, uri) values (?, ?, ?)",
          [user_Id, date, asset.uri],
          (txObj, resultSet) => {
          console.log("pic saved")         
          setPhoto(undefined);
          },
          (txObj, error) => console.log(error)
        );
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {hasMediaLibPermit ? (
            <TouchableOpacity onPress={savePhoto} style={styles.btn}>
              <FontAwesome name="floppy-disk" size={30} color="green" />
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.btn}>
            <FontAwesome name="trash-can" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Function</Text>
      <Camera style={styles.camera} ref={cameraRef}></Camera>
      <Button title="Snap Picture" onPress={takePic} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  camera: {
    width: 350,
    height: 450,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
    width: 350,
  },
  btn:{
    margin: 10,
    elevation: 5
  }
});
