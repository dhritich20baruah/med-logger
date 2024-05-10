import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Chart from "./Chart";
import * as SQLite from "expo-sqlite";

export default function BloodSugar({ route }) {
  const { userID } = route.params;
  const [fasting, setFasting] = useState([
    { date: "01-01-2024", type: "Fasting", sugar: "90" },
  ]);
  const [postprandial, setPostprandial] = useState([
    { date: "01-01-2024", type: "Postprandial", sugar: "100" },
  ]);
  const [random, setRandom] = useState([
    { date: "01-01-2024", type: "Random", sugar: "100" },
  ]);
  const [mgDL, setMgDL] = useState(true);
  const [testType, settestType] = useState(""); // State to track selected option
  const [sugarValue, setSugarValue] = useState(0);

   //DATABASE
   const db = SQLite.openDatabase("med-logger2.db");

  const toggleMgDL = () => {
    setMgDL(mgDL => !mgDL);
  };


  const handleSelect = (option) => {
    settestType(option);
  };

  const handleSubmit = () => {
    // Handle form submission here
    let dateString = new Date().toISOString();
    const sugarObj = {
      date: dateString
        .slice(0, dateString.indexOf("T"))
        .split("-")
        .reverse()
        .join("-"),
      type: testType,
      sugar: mgDL ? sugarValue : sugarValue*0.05,
      user_id: userID,
    };
    console.log(sugarObj)
  };

  // CHART DATA
  const fbsData = {
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
        data: [90, 95, 88, 90, 89, 93],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  const pbsData = {
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
        data: [90, 95, 88, 90, 89, 93],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  const rbsData = {
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
        data: [90, 95, 88, 90, 89, 93],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };
  return (
    <ScrollView>
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
              <Text style={styles.unit}>{!mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
            </View>
            <View style={styles.recordItem}>
              <Text style={styles.label}>Postprandial (PP)</Text>
              <Text style={styles.value}>
                {mgDL
                  ? postprandial[postprandial.length - 1].sugar
                  : postprandial[postprandial.length - 1].sugar * 0.05}
              </Text>
              <Text style={styles.unit}>{!mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
            </View>
            <View style={styles.recordItem}>
              <Text style={styles.label}>Random</Text>
              <Text style={styles.value}>
                {mgDL
                  ? random[random.length - 1].sugar
                  : random[random.length - 1].sugar * 0.05}
              </Text>
              <Text style={styles.unit}>{!mgDL ? "(mmol/L)" : "(mg/dL)"}</Text>
            </View>
          </View>
          <Button title="VIEW HISTORY" onPress={() => {}} color="#FFA500" />
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: "white",
            width: 350,
            elevation: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#800000",
              fontSize: 20,
            }}
          >
            ADD NEW RECORD
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={toggleMgDL}
              style={{
                marginRight: 10,
                padding: 10,
                backgroundColor: mgDL ? "orange" : "lightgray",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: mgDL ? "white" : "black" }}>mg/dL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMgDL}
              style={{
                padding: 10,
                backgroundColor: !mgDL ? "orange" : "lightgray",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: !mgDL ? "white" : "black" }}>mmol/l</Text>
            </TouchableOpacity>
          </View>

          {/* Radio buttons */}
          <View style={styles.container}>
            <Text style={{ fontSize: 18, color: "#800000", margin: 10 }}>
              Select test type:
            </Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  testType === "Fasting" && styles.selectedButton,
                ]}
                onPress={() => handleSelect("Fasting")}
              >
                <Text style={styles.radioText}>Fasting</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  testType === "Postprandial" && styles.selectedButton,
                ]}
                onPress={() => handleSelect("Postprandial")}
              >
                <Text style={styles.radioText}>Postprandial</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  testType === "Random" && styles.selectedButton,
                ]}
                onPress={() => handleSelect("Random")}
              >
                <Text style={styles.radioText}>Random</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.testTypeText}>
              Selected option: {testType}
            </Text>
            {testType && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  margin: 10,
                }}
              >
                <TextInput
                  style={{
                    height: 50,
                    width: 50,
                    borderBottomWidth: 2,
                    borderBottomColor: "#800000",
                    fontSize: 20,
                  }}
                  keyboardType="numeric"
                  value={sugarValue.toString()}
                  onChangeText={setSugarValue}
                />
                <Button title="ADD" onPress={handleSubmit} color="orange" />
              </View>
            )}
          </View>
        </View>

        {/* CHARTS */}
        <View style={{ margin: 10 }}>
          <Text style={{ textAlign: "center", color: "#800000" }}>
            Last Seven Fasting Blood Sugar Readings
          </Text>
          <Chart data={fbsData} />
          <Text style={{ textAlign: "center", color: "#800000" }}>
            Last Seven Postprandial Blood Sugar Readings
          </Text>
          <Chart data={pbsData} />
          <Text style={{ textAlign: "center", color: "#800000" }}>
            Last Seven Random Blood Sugar Readings
          </Text>
          <Chart data={rbsData} />
        </View>
      </View>
    </ScrollView>
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
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontSize: 20,
    color: "white",
    marginBottom: 5,
  },
  unit: {
    color: "white",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  radioButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#80000",
  },
  selectedButton: {
    backgroundColor: "orange",
    color: "white",
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  testTypeText: {
    marginTop: 20,
    fontSize: 16,
    color: "#800000",
  },
});
