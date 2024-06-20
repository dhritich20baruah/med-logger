import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

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

          <Button
            onPress={() => setModalVisible(false)}
            title="Close"
            color={"orange"}
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

export default Footer;
