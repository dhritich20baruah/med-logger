import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

export default function BloodSugar() {
  const [fasting, setFasting] = useState([{ date: "", type: "", sugar: "" }]);
  const [postprandial, setPostprandial] = useState([
    { date: "", type: "", sugar: "" },
  ]);
  const [random, setRandom] = useState([{ date: "", type: "", sugar: "" }]);
  const [mgDL, setMgDL] = useState(true);
  const [testType, setTestType] = useState("");
  const [sugarValue, setSugarValue] = useState(0);
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);

  const toggleMgDL = () => {
    setMgDL(!mgDL);
  };

  const testOptions = ["Fasting", "Postprandial", "Random"];

  const handleSelect = (index, value) => {
    setTestType(value);
  };

  const handleSubmit = () => {
    // Handle form submission here
  };
  return (
    <View style={styles.container}>
      <View style={styles.recordContainer}>
        <Text style={styles.heading}>Last Record</Text>
        <View style={styles.lastRecord}>
          <View style={styles.recordItem}>
            <Text style={styles.label}>Fasting</Text>
            <Text style={styles.value}>
              {mgDL
                ? fasting[fasting.length - 1].sugar
                : fasting[fasting.length - 1].sugar * 0.05}
            </Text>
            <Text style={styles.unit}>{mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.label}>Postprandial (PP)</Text>
            <Text style={styles.value}>
              {mgDL
                ? postprandial[postprandial.length - 1].sugar
                : postprandial[postprandial.length - 1].sugar * 0.05}
            </Text>
            <Text style={styles.unit}>{mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.label}>Random</Text>
            <Text style={styles.value}>
              {mgDL
                ? random[random.length - 1].sugar
                : random[random.length - 1].sugar * 0.05}
            </Text>
            <Text style={styles.unit}>{mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
          </View>
        </View>
        <Button title="VIEW HISTORY" onPress={() => {}} color="#FFA500" />
      </View>
      <View style={{margin: 5, backgroundColor: 'white', color: 'black'}}>
        <Text>ADD NEW RECORD</Text>
        <View style={{ flexDirection: "row", marginBottom: 10, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={toggleMgDL}
            style={{
              marginRight: 10,
              padding: 10,
              backgroundColor: mgDL ? "lightgray" : "orange",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: mgDL ? "black" : "white" }}>mg/dL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleMgDL}
            style={{
              padding: 10,
              backgroundColor: mgDL ? "orange" : "lightgray",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: mgDL ? "white" : "black" }}>mmol/l</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>Select type (Fasting/PPBS/Random):</Text>
          <ModalDropdown
            options={testOptions}
            onSelect={handleSelect}
            dropdownTextStyle={styles.dropdownText}
            dropdownStyle={styles.dropdown}
            initialScrollIndex={initialScrollIndex}
          />
          <Text style={styles.selectedValue}>Selected value: {testType}</Text>
          {testType && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={sugarValue.toString()}
              onChangeText={(text) => setSugarValue(text)}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="ADD" onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  recordContainer: {
    backgroundColor: "#800000",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: 400,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 10,
  },
  lastRecord: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    color: "white",
  },
  recordItem: {
    alignItems: "center",
  },
  label: {
    color: "white",
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    color: "white",
    marginBottom: 5,
  },
  unit: {
    color: "white",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
  },
  dropdown: {
    flex: 1,
    height: 50,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#A0AEC0",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
