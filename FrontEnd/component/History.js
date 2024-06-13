import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import * as SQLite from "expo-sqlite";

export default function History({ navigation, route }) {
  const { userID } = route.params;
  const [selected, setSelected] = useState("");
  const [data, setData] = useState({
    diagnosticArr: [],
    pillsArr: [],
    sugarArr: [],
    pressureArr: [],
    visitArr: [],
  });

  const db = SQLite.openDatabase("med-logger2.db");

  const handleDate = (day) => {
    setSelected(day.dateString);

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM diagnosticReports WHERE user_id = ? AND date = ?",
        [userID, day.dateString.split("-").reverse().join("-")],
        (txObj, resultSet) => {
          setData((prevData) => ({
            ...prevData,
            diagnosticArr: resultSet.rows._array,
          }));
        },
        (txObj, error) => console.log(error)
      );

      tx.executeSql(
        "SELECT * FROM medicine_list WHERE user_id = ? AND endDate <= ?",
        [userID, day.dateString],
        (txObj, resultSet) => {
          setData((prevData) => ({
            ...prevData,
            pillsArr: resultSet.rows._array,
          }));
        },
        (txObj, error) => console.log(error)
      );

      tx.executeSql(
        "SELECT * FROM blood_sugar WHERE user_id = ? AND date = ?",
        [userID, day.dateString.split("-").reverse().join("-")],
        (txObj, resultSet) => {
          setData((prevData) => ({
            ...prevData,
            sugarArr: resultSet.rows._array,
          }));
        },
        (txObj, error) => console.log(error)
      );

      tx.executeSql(
        "SELECT * FROM blood_pressure WHERE user_id = ? AND date = ?",
        [userID, day.dateString.split("-").reverse().join("-")],
        (txObj, resultSet) => {
          setData((prevData) => ({
            ...prevData,
            pressureArr: resultSet.rows._array,
          }));
        },
        (txObj, error) => console.log(error)
      );

      tx.executeSql(
        "SELECT * FROM doctors_Info WHERE user_id = ? AND nextVisit = ?",
        [userID, day.dateString],
        (txObj, resultSet) => {
          setData((prevData) => ({
            ...prevData,
            visitArr: resultSet.rows._array,
          }));
        },
        (txObj, error) => console.log(error)
      );
    });   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Select a date
      </Text>
      <Calendar
        initialDate={new Date().toISOString().split("T")[0]}
        maxDate={new Date().toISOString().split("T")[0]}
        disableAllTouchEventsForDisabledDays={true}
        onDayPress={handleDate}
      />
      {/* Add more UI components to display the fetched data */}
      <Text style={styles.headerText}>
        Select a date: {selected}
      </Text>
      <Button title="View History" onPress={()=>{ navigation.navigate("Day's Activity", {selected, data})}} color={'#800000'}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerText: {
    textAlign: "center",
    fontSize: 15,
    margin: 15,
  },
});
