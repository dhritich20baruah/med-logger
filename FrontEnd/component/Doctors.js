import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("med-logger2.db");

export default function Doctors({ navigation, route }) {
  const { userID } = route.params;
  const [doctorList, setDoctorList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorsDetails, setDoctorsDetails] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS doctors_Info (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, specialty TEXT, address TEXT, contactNumber TEXT, lastVisited TEXT, nextVisit TEXT, prescription TEXT, user_id INTEGER)"
      );
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, [])
  );

  const fetchDoctors = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM doctors_Info WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          setDoctorList(resultSet.rows._array);
          console.log(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  // MODAL FUNCTION
  const doctorInfo = (id) => {
    console.log(id);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM doctors_Info WHERE id = ? AND user_id = ?",
        [id, userID],
        (txObj, resultSet) => {
          console.log(resultSet.rows._array);
          setDoctorsDetails(resultSet.rows._array)
          setModalVisible(true);
        },
        (txObj, error) => console.log("Error fetching doctor's details:", error)
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {doctorList.map((item) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.doctorCard}
              onPress={() => doctorInfo(item.id)}
            >
              <FontAwesome
                name="user-doctor"
                size={60}
                color="#3b3b3b"
                style={{ marginHorizontal: 10 }}
              />
              <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  {item.name}
                  {item.id}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "300" }}>
                  {item.specialty}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={{ margin: 10 }}>
                <FontAwesome name="trash-can" size={25} color="#800000" />
              </TouchableOpacity>
              <TouchableOpacity style={{ margin: 10 }}>
                <FontAwesome name="pen-to-square" size={25} color="#800000" />
              </TouchableOpacity>
            </View>
            <View>
              {doctorsDetails.map((item) => {
                return (
                  <View key={item.id} style={{}}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: "600"}}>{item.name}</Text>
                    <Text>{item.specialty}</Text>
                    <Text>{item.contactNumber}</Text>
                    <Text>{item.address}</Text>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.saveBtnContainer}
            >
              <Text style={styles.saveBtn}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Add Doctor Information", {
              userID,
              onGoBack: fetchDoctors,
            })
          }
          style={styles.floatBtn}
        >
          <Text style={styles.btnText}>Add Doctor</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  doctorCard: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
    borderWidth: 1,
    borderColor: "#800000",
    padding: 10,
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    width: 350,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: "#800000",
  },
  modalTitle: {
    margin: 5,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#800000",
  },
  modalText: {
    margin: 5,
    textAlign: "center",
    fontSize: 15,
    color: "#800000",
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
  saveBtnContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "orange",
  },
  saveBtn: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
