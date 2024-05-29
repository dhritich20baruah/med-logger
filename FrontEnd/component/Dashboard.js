import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import * as SQLite from "expo-sqlite";

const Dashboard = ({ navigation, route }) => {
  const [users, setUsers] = useState([{id:"", name: "", weight: "", height: ""}]);
  const { userID } = route.params;

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user_info WHERE id = ?",
        [userID],
        (txObj, resultSet) => setUsers(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setIsLoading(false);
  }, []);

  return (
    <View>
      <Text style={{color: "#800000", fontSize: 20, textAlign: "center", fontWeight: "bold"}}>Hello, {users[0].name}</Text>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <FontAwesome name="heart-pulse" size={50} color="#800000" />
            <Text style={styles.tileText}>Blood Pressure</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Blood Pressure", {userID})}
            >
              <Text style={styles.tileButton}>RECORD</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <FontAwesome name="droplet" size={50} color="#800000" />
            <Text style={styles.tileText}>Blood Sugar</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Blood Sugar", {userID})}
            >
              <Text style={styles.tileButton}>RECORD</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <FontAwesome name="x-ray" size={50} color="#800000" />
            <Text style={styles.tileText}>Diagnostic Reports</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Diagnostic Reports", {userID})}
            >
              <Text style={styles.tileButton}>RECORD</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <FontAwesome name="pills" size={50} color="#800000" />
            <Text style={styles.tileText}>Pill Tracker</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Pill Tracker", {userID})}
            >
              <Text style={styles.tileButton}>TRACK</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <FontAwesome name="user-doctor" size={50} color="#800000" />
            <Text style={styles.tileText}>Your Doctors</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Your Doctors")}
            >
              <Text style={styles.tileButton}>SAVE & VIEW</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cell}>
            <FontAwesome name="calendar-days" size={50} color="#800000" />
            <Text style={styles.tileText}>History</Text>
            <TouchableOpacity onPress={() => navigation.navigate("History")}>
              <Text style={styles.tileButton}>VIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cell: {
    width: 180,
    height: 200,
    backgroundColor: "white",
    margin: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  tileText: {
    margin: 5,
    color: "#800000",
  },
  tileButton: {
    backgroundColor: "orange",
    color: "white",
    padding: 5,
  },
});

export default Dashboard;
