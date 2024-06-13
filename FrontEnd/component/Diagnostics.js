import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

const Diagnostics = ({ navigation, route }) => {
  const { userID } = route.params;
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [photos, setPhotos] = useState([]);

  const toggleCamera = () => {
    navigation.navigate("Camera", { userID });
  };

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === "granted");
    })();

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS diagnosticReports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, date TEXT, uri TEXT, doctor TEXT, notes TEXT)"
      );
    });
  }, []);

  const fetchImages = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM diagnosticReports WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          setPhotos(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View>
        <Text>No access to media library</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Image", { uri: item.uri, imageId: item.id, doctor: item.doctor, notes: item.notes })
            }
          >
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </TouchableOpacity>
        )}
        numColumns={3}
      />
      <TouchableOpacity onPress={toggleCamera} style={styles.floatBtn}>
        <FontAwesome
          name="camera"
          size={50}
          color="white"
          style={styles.btnText}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleCamera} style={styles.floatBtnGallery}>
      <FontAwesome
            name="images"
            size={50}
            color="white"
            style={styles.btnText}
          />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  photo: {
    width: 115,
    height: 115,
    margin: 1,
  },
  floatBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    position: "absolute",
    borderRadius: 10,
    top: 580,
    right: 30,
    padding: 3,
    elevation: 15,
  },
  btnText: {
    color: "white",
    fontSize: 30,
    padding: 3,
  },
  floatBtnGallery: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    position: "absolute",
    borderRadius: 10,
    top: 650,
    right: 30,
    padding: 3,
    elevation: 15,
  },
});

export default Diagnostics;
