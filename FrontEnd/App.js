import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeWindStyleSheet } from "nativewind";
import * as SQLite from "expo-sqlite";
import Dashboard from "./component/Dashboard";
import BloodPressure from "./component/BloodPressure";
import BloodSugar from "./component/BloodSugar";
import Diagnostic from "./component/Diagnostics";
import Pills from "./component/Pills";
import Doctors from "./component/Doctors";
import History from "./component/History";

NativeWindStyleSheet.setOutput({
  default: "native",
});

function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState(false);
  const [weightUnit, setWeightUnit] = useState(false);
  const [feet, setFeet] = useState("");
  const [inch, setInch] = useState("");

  const toggleWeightUnit = () => {
    setWeightUnit((prevState) => !prevState);
  };

  const toggleHeightUnit = () => {
    setHeightUnit((prevState) => !prevState);
  };

  //DATABASE
  const db = SQLite.openDatabase("med-logger.db");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user_info (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, weight REAL, height REAL)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user_info",
        null,
        (txObj, resultSet) => console.log(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    setIsLoading(false);
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Name is required");
      return;
    }
    if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
      Alert.alert("Age must be a positive number");
      return;
    }
    if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      Alert.alert("Weight must be a positive number");
      return;
    }
    if (heightUnit) {
      if (isNaN(parseInt(feet)) || parseInt(feet) <= 0) {
        Alert.alert("Feet must be a positive number");
        return;
      }
      if (isNaN(parseInt(inch)) || parseInt(inch) < 0 || parseInt(inch) >= 12) {
        Alert.alert("Inches must be a number between 0 and 11");
        return;
      }
    } else {
      if (isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
        Alert.alert("Height must be a positive number");
        return;
      }
    }

    // Convert units if necessary
    let heightResult = height;
    let weightResult = weight;
    if (heightUnit) {
      const totalInches = parseInt(feet) * 12 + parseInt(inch);
      heightResult = totalInches * 2.54;
    }
    if (weightUnit) {
      weightResult = parseInt(weight) * 0.45;
    }

    // Handle form submission
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO user_info (name, age, weight, height) values (?, ?, ?, ?)",
        [name, age, weightResult, heightResult],
        (txObj, resultSet) => {
          console.log(
            "name:",
            name,
            "age:",
            age,
            "weight:",
            weightResult,
            "height:",
            heightResult
          );
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <Text style={{ marginBottom: 5 }}>
        Weight ({weightUnit ? "lb" : "kg"})
      </Text>
      <TextInput
        placeholder={`Weight (${weightUnit ? "lb." : "kg."})`}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "gray",
        }}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={toggleWeightUnit}
          style={{
            marginRight: 10,
            padding: 10,
            backgroundColor: weightUnit ? "lightgray" : "blue",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: weightUnit ? "black" : "white" }}>Kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleWeightUnit}
          style={{
            padding: 10,
            backgroundColor: weightUnit ? "blue" : "lightgray",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: weightUnit ? "white" : "black" }}>lb.</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ marginBottom: 5 }}>
          Height ({heightUnit ? "ft-in" : "cm"})
        </Text>
        {heightUnit ? (
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Feet"
              value={feet}
              onChangeText={setFeet}
              keyboardType="numeric"
              style={{
                marginRight: 10,
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            <TextInput
              placeholder="Inches"
              value={inch}
              onChangeText={setInch}
              keyboardType="numeric"
              style={{
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View>
        ) : (
          <TextInput
            placeholder="Height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={{ padding: 10, borderWidth: 1, borderColor: "gray" }}
          />
        )}
      </View>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={toggleHeightUnit}
          style={{
            marginRight: 10,
            padding: 10,
            backgroundColor: heightUnit ? "lightgray" : "blue",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: heightUnit ? "black" : "white" }}>cm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleHeightUnit}
          style={{
            padding: 10,
            backgroundColor: heightUnit ? "blue" : "lightgray",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: heightUnit ? "white" : "black" }}>ft-in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>
      <Button
        title="Dashboard"
        onPress={() => navigation.navigate("Dashboard")}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            title: "Home",
            headerStyle: {
              backgroundColor: "#6D5ACF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Blood Pressure"
          component={BloodPressure}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Blood Sugar"
          component={BloodSugar}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Diagnostic Reports"
          component={Diagnostic}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Pill Tracker"
          component={Pills}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
          <Stack.Screen
          name="Your Doctors"
          component={Doctors}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
          <Stack.Screen
          name="History"
          component={History}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
