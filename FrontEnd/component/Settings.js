import React, { useState, useMemo, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";

//DATABASE
const db = SQLite.openDatabase("med-logger2.db");

export default function Settings({ navigation, route }) {
  const { userID } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM userData WHERE id = ?",
        [userID],
        (txObj, resultSet) => {
          setUsers(resultSet.rows._array);
          console.log(resultSet.rows._array)
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.touch}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.btnText}>Delete Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.btnText}>Export Data</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
    
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'column',
  },
  touch:{
    backgroundColor: "#800000",
    margin: 5,
    padding: 10
  },
  btnText: {
    fontSize: 20,
    margin: 2,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
