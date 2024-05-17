import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";

const Gallery = ({ userId }) => {
  let user_Id = userId;
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [photos, setPhotos] = useState([]);
  const [image, setImage] = useState("");

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

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if(!result.canceled){
        setImage(result.assets[0].uri)
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={{width: 350}} />}
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={handleImagePicker}>
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
});

export default Gallery;
