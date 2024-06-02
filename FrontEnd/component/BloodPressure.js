import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import Chart from "./Chart";
import * as SQLite from "expo-sqlite";

export default function BloodPressure({ navigation, route }) {
  const { userID } = route.params;
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [prevReadings, setPrevReadings] = useState([
    {
      date: "01-01-2024",
      systolic: "120",
      diastolic: "70",
      pulse: "60",
    },
  ]);

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
        "SELECT * FROM blood_pressure WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          const readings = resultSet.rows._array.map((item) => ({
            date: item.date,
            systolic: item.systolic,
            diastolic: item.diastolic,
            pulse: item.pulse,
          }));
          // Update the state with the fetched readings
          setPrevReadings(readings);
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  const submitPressure = () => {
    let dateString = new Date().toISOString();
    let date = dateString
      .slice(0, dateString.indexOf("T"))
      .split("-")
      .reverse()
      .join("-");
  
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO blood_pressure (systolic, diastolic, pulse, user_id, date) values (?, ?, ?, ?, ?)",
        [systolic, diastolic, pulse, userID, date],
        (txObj, resultSet) => {
          let lastReading = [...prevReadings];
          lastReading.push({
            id: resultSet.insertId,
            systolic: systolic,
            diastolic: diastolic,
            pulse: pulse,
            date: date,
          });
          setPrevReadings(lastReading);
          setSystolic("");
          setDiastolic("");
          setPulse("");
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const pressureData = {
    labels: prevReadings.map((item) => item.date).slice(-7),
    datasets: [
      {
        data: prevReadings.length >= 7
        ? prevReadings.map((item) => item.systolic).slice(-7)
        : prevReadings.map((item) => item.systolic),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: prevReadings.length >= 7 ? prevReadings.map((item) => item.diastolic).slice(-7) : prevReadings.map((item) => item.diastolic),
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
      <Text style={{ textAlign: "center", margin: 10, color: "#800000" }}>
        Last Seven Blood Pressure Readings
      </Text>
      <Chart data={pressureData} />
    </View>
  );
}

const RecordCard = ({ prevReadings }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Last Record</Text>
      <View style={styles.recordContainer}>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Systolic</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.systolic}
          </Text>
          <Text style={styles.recordValue}>mmHg</Text>
        </View>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Diastolic</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.diastolic}
          </Text>
          <Text style={styles.recordValue}>mmHg</Text>
        </View>
        <View style={styles.recordItem}>
          <Text style={styles.recordLabel}>Pulse</Text>
          <Text style={styles.recordValue}>
            {prevReadings[prevReadings.length - 1]?.pulse}
          </Text>
          <Text style={styles.recordValue}>BPM</Text>
        </View>
      </View>
      <Button
        title="VIEW ALL"
        color="#FFA500"
        onPress={() => setModalVisible(true)}
      />
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <ScrollView>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Your historical data</Text>
                <View style={styles.table}>
                  <View style={{display: "flex", flexDirection: "row"}}>
                    <Text style={styles.tableHeader}>Date</Text>
                    <Text style={styles.tableHeader}>Systolic</Text>
                    <Text style={styles.tableHeader}>Diastolic</Text>
                    <Text style={styles.tableHeader}>Pulse</Text>
                  </View>
                  {prevReadings.map((item, index) => {
                    return (
                      <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.date}</Text>
                        <Text style={styles.tableCell}>{item.systolic}</Text>
                        <Text style={styles.tableCell}>{item.diastolic}</Text>
                        <Text style={styles.tableCell}>{item.pulse}</Text>
                      </View>
                    );
                  })}
                </View>
                <Button
                  onPress={() => setModalVisible(false)}
                  title="Close"
                  color={"orange"}
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
        <Button onPress={() => setModalVisible(true)} title="Open Modal" />
      </View>
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
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#800000",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "80%",
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
    fontSize: 20
  },
  table: {
    width: 320,
    marginVertical: 10
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex:1, 
    padding: 5, 
    fontWeight: 'bold', 
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 3,    
    textAlign: 'center'
  },
});
