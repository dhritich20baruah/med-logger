import React, { useEffect, useState, useRef, Modal, Button } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";

const Gallery = ({ userId }) => {
  let user_Id = userId;
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [photos, setPhotos] = useState([]);
  const [image, setImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === "granted");
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
        (txObj, resultSet) => {
          setPhotos(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  if (hasMediaLibraryPermission === false) {
    return (
      <View>
        <Text>No access to media library</Text>
      </View>
    );
  }

  const handleImage = async (uri) => {
    setImage(uri)
    setModalVisible(modalVisible => !modalVisible)
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>handleImage(item.uri)}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </TouchableOpacity>
        )}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    width: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Gallery;
