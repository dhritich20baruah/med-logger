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

export default function EditDoctor({ route }) {
  const navigation = useNavigation();
  const { userID, doctorsDetails } = route.params;
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState(doctorsDetails[0].name);
  const [specialty, setSpecialty] = useState(doctorsDetails[0].specialty);
  const [address, setAddress] = useState(doctorsDetails[0].address);
  const [contactNumber, setContactNumber] = useState(
    doctorsDetails[0].contactNumber
  );
  const [lastVisited, setLastVisited] = useState(doctorsDetails[0].lastVisited ? doctorsDetails[0].lastVisited : date);
  const [nextVisit, setNextVisit] = useState(doctorsDetails[0].nextVisit ? doctorsDetails[0].nextVisit : date);
  const [prescription, setPrescription] = useState(
    doctorsDetails[0].prescription
  );
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
    console.log(
      name,
      specialty,
      address,
      contactNumber,
      lastVisited.toISOString(),
      nextVisit.toISOString(),
      prescription,
      userID
    );
    if (validateForm()) {
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
      <Text style={styles.title}>Edit Doctor's Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Specialty"
        value={specialty}
        onChangeText={setSpecialty}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <Text style={styles.textStyle}>You last visited on:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowLastVisitedPicker(true)}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showLastVisitedPicker && (
        <DateTimePicker
          value={lastVisited}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            handleDateChange(event, selectedDate, setLastVisited)
          }
        />
      )}
      <Text style={styles.textStyle}>Your next visit should be on &#40; You will be reminded a day before this date &#41;:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowNextVisitPicker(true)}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showNextVisitPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            handleDateChange(event, selectedDate, setNextVisit)
          }
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
  textStyle: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '500'
  }
});
