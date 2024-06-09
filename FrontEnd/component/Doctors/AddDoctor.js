import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("med-logger2.db");
import { useNavigation } from "@react-navigation/native";

export default function AddDoctor({route}) {
    const navigation = useNavigation()
    const { userID, onGoBack } = route.params
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [lastVisited, setLastVisited] = useState(new Date());
    const [nextVisit, setNextVisit] = useState(new Date());
    const [prescription, setPrescription] = useState("");
    const [showLastVisitedPicker, setShowLastVisitedPicker] = useState(false);
    const [showNextVisitPicker, setShowNextVisitPicker] = useState(false); 
  
    const handleDateChange = (event, selectedDate, setDate) => {
      const currentDate = selectedDate || new Date();
      setShowLastVisitedPicker(false);
      setShowNextVisitPicker(false);
      setDate(currentDate);
    };
  
    const validateForm = () => {
      if (!name.trim() || !specialty.trim()) {
        Alert.alert("Validation Error", "Name and Specialty are required.");
        return false;
      }
      return true;
    };
  
    const handleSubmit = () => {
        console.log(name, specialty, address, contactNumber, lastVisited.toISOString(), nextVisit.toISOString(), prescription , userID)
      if (validateForm()) {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO doctors_Info (name, specialty, address, contactNumber, lastVisited, nextVisit, prescription, user_id) values (?, ?, ?, ?, ?, ?, ?, ?)",
            [name, specialty, address, contactNumber, lastVisited.toISOString(), nextVisit.toISOString(), prescription , userID],
            (txObj, resultSet) => {
              Alert.alert("Success", "Doctor's information saved successfully!");
              clearForm();
              onGoBack(); // Call the callback function
              navigation.goBack(); // Navigate back to the previous screen
            },
            (txObj, error) => {
              console.log(error);
              Alert.alert("Error", "An error occurred while saving the doctor's information.");
            }
          );
        });
      }
    };
  
    const clearForm = () => {
      setName("");
      setSpecialty("");
      setAddress("");
      setContactNumber("");
      setLastVisited(new Date());
      setNextVisit(new Date());
      setPrescription("");
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Doctor's Information</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Specialty" value={specialty} onChangeText={setSpecialty} />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        <TouchableOpacity onPress={() => setShowLastVisitedPicker(true)}>
          <TextInput style={styles.input} placeholder="Last Visited On" value={lastVisited.toDateString()} editable={false} />
        </TouchableOpacity>
        {showLastVisitedPicker && (
          <DateTimePicker
            value={lastVisited}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setLastVisited)}
          />
        )}
        <TouchableOpacity onPress={() => setShowNextVisitPicker(true)}>
          <TextInput style={styles.input} placeholder="Next Scheduled Visit" value={nextVisit.toDateString()} editable={false} />
        </TouchableOpacity>
        {showNextVisitPicker && (
          <DateTimePicker
            value={nextVisit}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, setNextVisit)}
          />
        )}
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Notes"
          value={prescription}
          onChangeText={setPrescription}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      padding: 10,
      borderWidth: 1,
      borderColor: "#800000",
      borderRadius: 5,
      marginBottom: 10,
    },
    button: {
      width: "100%",
      padding: 15,
      backgroundColor: "#800000",
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });