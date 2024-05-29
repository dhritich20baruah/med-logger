import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AddMedicine from "./PillTracker/AddMedicine";

export default function Pills({ navigation, route }) {
  const { userID } = route.params;

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Add Medicine", { userID })}
        style={styles.floatBtn}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    floatBtn: {
        width: 50,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#800000",
        position: 'absolute',
        borderRadius: 50,
        top: 650,
        right: 30
    },
    btnText: {
        color: 'white',
        fontSize: 30
    }
})