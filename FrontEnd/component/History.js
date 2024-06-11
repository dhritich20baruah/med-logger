import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import * as SQLite from "expo-sqlite";

export default function History({ navigation, route }) {
  const { userID } = route.params;
  let dateString = new Date().toISOString();
  let maxDate = dateString.slice(0, dateString.indexOf("T"));
  const [selected, setSelected] = useState("");

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

  const handleDate = (day) => {
    setSelected(day.dateString);
    console.log(day.dateString);
  };

  return (
    <View style={{ display: "flex", justifyContent: "center" }}>
      <Text style={{ textAlign: "center", fontSize: 15, margin: 15 }}>
        Press on a date to know your activity for that day
      </Text>
      <Calendar
        initialDate={maxDate}
        maxDate={maxDate}
        disableAllTouchEventsForDisabledDays={true}
        onDayPress={(day) => {
          handleDate(day);
        }}
      />
    </View>
  );
}
