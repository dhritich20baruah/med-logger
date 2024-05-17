import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CameraFunction from "./CameraFunction";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import Gallery from "./Gallery";

const Diagnostics = ({ route }) => {
  const { userID } = route.params;
  console.log(userID)
  const [showCamera, setShowCamera] = useState(false);

  const toggleCamera = () => {
    setShowCamera((showCamera) => !showCamera);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleCamera}
        style={{
          marginRight: 10,
          padding: 10,
          borderRadius: 50,
          backgroundColor: "#800000",
        }}
      >
        {showCamera ? (
          <Text style={{ fontSize: 30, color: "white" }}>X</Text>
        ) : (
          <FontAwesome name="camera" size={50} color="white" />
        )}
      </TouchableOpacity>
      {showCamera ? (
        <CameraFunction userId={userID}/>
      ) : (
        <Gallery userId={userID}/>
      )}
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
});

export default Diagnostics;
