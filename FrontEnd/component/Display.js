import {
  View,
  Image,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import * as SQLite from "expo-sqlite";
import { shareAsync } from "expo-sharing";
import { useNavigation } from '@react-navigation/native';

export default function Display({ route }) {
  const { uri } = route.params;
  const [permission, setPermission] = useState(null);

  const navigation = useNavigation();

  const db = SQLite.openDatabase("med-logger2.db");

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  const handleDelete = async () => {
    if (!permission) {
      Alert.alert(
        "Permission Denied",
        "You need to grant media library permissions first."
      );
      return;
    }

    if (!uri) {
      Alert.alert("Invalid URI", "Please provide a valid URI.");
      return;
    }

    try {
      const assets = await MediaLibrary.getAssetsAsync({ uri });

      if (assets.assets.length === 0) {
        Alert.alert("No asset found with provided URI");
        return;
      }

      const assetId = assets.assets[0].id;

      //    await MediaLibrary.deleteAssetsAsync([assetId])
      console.log(assetId);
      Alert.alert("Image Deleted");
      navigation.goBack()
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image");
    }
  };
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} />
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableOpacity style={{ backgroundColor: "#800000", margin: 20, padding: 10 }} onPress={handleDelete}>
        <FontAwesome name="trash-can" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: "#800000", margin: 20, padding: 10 }}>
        <FontAwesome name="share-nodes" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 350,
    margin: 1,
  },
});
