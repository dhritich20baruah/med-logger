import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

export default function Doctors({navigation, route}) {
    const {userID} = route.params
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Add Doctor Information", { userID })}
        style={styles.floatBtn}
      >
        <Text style={styles.btnText}>Add Doctor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  floatBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    position: "absolute",
    borderRadius: 10,
    top: 650,
    right: 30,
    padding: 3,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    padding: 3,
  },
});
