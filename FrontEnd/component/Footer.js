import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { Profile } from "./Settings";
import * as SQLite from "expo-sqlite";

//DATABASE
const db = SQLite.openDatabase("med-logger2.db");

const Footer = ({userID}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(()=>{
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
  }, [])

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate("Med Logger")}
      >
        <FontAwesome
          name="house"
          size={35}
          color="#800000"
          style={styles.footerText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome
          name="gear"
          size={35}
          color="#800000"
          style={styles.footerText}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: "#800000", margin: 10}}>Settings</Text>
            <TouchableOpacity style={styles.modalTouch} onPress={()=>setProfileVisible(!profileVisible)}>
              <Text style={styles.modalText}>My Profile</Text>
              {profileVisible && 
              (
                <View style={styles.profileContainer}>
                <Text style={styles.profileText}>{users[0].name}</Text>
                <Text style={styles.profileText2}>{users[0].age} Years | {users[0].height} cm | {users[0].weight} kg</Text>
                <Text style={styles.profileText2}>Breakfast Time: {users[0].breakfast} hrs</Text>
                <Text style={styles.profileText2}>Lunch Time: {users[0].lunch} hrs</Text>
                <Text style={styles.profileText2}>Dinner Time: {users[0].dinner} hrs</Text>
            </View>
              )
              }
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalTouch}>
              <Text style={styles.modalText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalTouch}>
              <Text style={styles.modalText}>Delete Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalTouch}>
              <Text style={styles.modalText}>Export Data</Text>
            </TouchableOpacity>
            <Button
              onPress={() => setModalVisible(false)}
              title="Close"
              color="#800000"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    paddingVertical: 10,
    position: "absolute",
    top: "100%",
    width: "100%",
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    color: "#800000",
    fontSize: 25,
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
    shadowColor: "#800000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 15,
  },
  modalTouch: {
    borderBottomWidth: 1,
    borderColor: "#800000",
    width: "100%",
    margin: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center'
},
profileText: {
    fontSize: 16,
    margin: 2,
    fontWeight: '700',
    color: 'gray'
},
profileText2: {
    fontSize: 16,
    margin: 2,
    fontWeight: '400',
    color: 'gray'
}
});

export default Footer;
