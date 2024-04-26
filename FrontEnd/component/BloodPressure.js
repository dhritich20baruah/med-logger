import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Chart from "./Chart";

export default function BloodPressure() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");

  const submitPressure = () => {
    // Add logic to submit pressure
  };

  const prevReadings = [{ systolic: 120, diastolic: 80, pulse: 70 }]; // Example previous readings

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
      <Chart/>
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
            onChangeText={(text) => setSystolic(text)}
            placeholder="0"
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>Diastolic (mmHg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={diastolic}
            onChangeText={(text) => setDiastolic(text)}
            placeholder="0"
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputLabel}>Pulse (BPM)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pulse}
            onChangeText={(text) => setPulse(text)}
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
