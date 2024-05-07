import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Chart from "./Chart";
import * as SQLite from "expo-sqlite";

export default function BloodPressure({ navigation, route}) {
  const { userID } = route.params;
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [prevReadings, setPrevReadings] = useState([{
    "date": "",
    "systolic": "",
    "diastolic": "",
    "pulse": ""
  }])

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS blood_pressure (id INTEGER PRIMARY KEY AUTOINCREMENT, systolic INTEGER, diastolic INTEGER, pulse INTEGER, user_id INTEGER, date TEXT)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM blood_pressure WHERE id = ?",
        [userID],
        (txObj, resultSet) => {
          setPrevReadings(resultSet.rows._array);
          console.log(prevReadings);
        },
        (txObj, error) => console.log(error)
      );
    });
    // setIsLoading(false);
  }, []);

  const submitPressure = () => {
    let dateString = new Date().toISOString()
    let date = dateString.slice(0, dateString.indexOf("T")).split("-").reverse().join("-")
    const pressureObj = {
      date: dateString.slice(0, dateString.indexOf("T")).split("-").reverse().join("-"),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: parseInt(pulse),
      user_id: userID
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO blood_pressure (systolic, diastolic, pulse, user_id, date) values (?, ?, ?, ?, ?)",
        [systolic, diastolic, pulse, userID, date],
        (txObj, resultSet) => {
          let lastReading = [...prevReadings];
          lastReading.push({ id: resultSet.insertId, systolic: systolic, diastolic: diastolic, pulse: pulse, date: date });
          setPrevReadings(lastReading);
          setSystolic("");
          setDiastolic("");
          setPulse("");
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  // const prevReadings = [{ systolic: 120, diastolic: 80, pulse: 70 }]; // Example previous readings

  const pressureData = {
    labels: [
      "01-05-2024",
      "02-05-2024",
      "03-05-2024",
      "04-05-2024",
      "05-05-2024",
      "06-05-2024",
    ],
    datasets: [
      {
        data: [70, 75, 78, 70, 79, 73],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: [120, 125, 128, 120, 129, 123],
        color: (opacity = 1) => `rgba(134, 65, 204, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <View>
      <RecordCard prevReadings={prevReadings} />
      <AddRecordForm
        systolic={systolic}
        setSystolic={setSystolic}
        diastolic={diastolic}
        setDiastolic={setDiastolic}
        pulse={pulse}
        setPulse={setPulse}
        submitPressure={submitPressure}
      />
      <Chart data={pressureData} />
    </View>
  );
}

const RecordCard = ({ prevReadings }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Last Record</Text>
      <View style={styles.recordContainer}>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Systolic</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.systolic} mmHg
          </Text>
        </View>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Diastolic</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.diastolic} mmHg
          </Text>
        </View>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Pulse</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.pulse} BPM
          </Text>
        </View>
      </View>
      <Button title="VIEW ALL" color="#FFA500" />
    </View>
  );
};

const AddRecordForm = ({
  systolic,
  setSystolic,
  diastolic,
  setDiastolic,
  pulse,
  setPulse,
  submitPressure,
}) => {
  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>ADD NEW RECORD</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>Systolic (mmHg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={systolic}
            onChangeText={setSystolic}
            placeholder="0"
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>Diastolic (mmHg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={diastolic}
            onChangeText={setDiastolic}
            placeholder="0"
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>Pulse (BPM)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pulse}
            onChangeText={setPulse}
            placeholder="0"
          />
        </View>
      </View>
      <Button title="ADD" color="#FFA500" onPress={submitPressure} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  recordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  recordItem: {
    flex: 1,
    alignItems: "center",
  },
  recordLabel: {
    color: "#FFFFFF",
    marginBottom: 5,
  },
  recordValue: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  form: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    color: "#800000",
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputItem: {
    flex: 1,
    alignItems: "center",
  },
  inputLabel: {
    color: "#800000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#800000",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "80%",
  },
});
