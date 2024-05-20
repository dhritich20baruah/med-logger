import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SQLite from "expo-sqlite";
import Dashboard from "./component/Dashboard";
import BloodPressure from "./component/BloodPressure";
import BloodSugar from "./component/BloodSugar";
import Diagnostic from "./component/Diagnostics";
import Pills from "./component/Pills";
import Doctors from "./component/Doctors";
import History from "./component/History";
import Display from "./component/Display";

function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inch, setInch] = useState("");
  const [heightUnit, setHeightUnit] = useState(false);
  const [weightUnit, setWeightUnit] = useState(false);
  const [users, setUsers] = useState([])

  const toggleWeightUnit = () => {
    setWeightUnit((prevState) => !prevState);
  };

  const toggleHeightUnit = () => {
    setHeightUnit((prevState) => !prevState);
  };

  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");
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
        (txObj, resultSet) => {setUsers(resultSet.rows._array)},
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
          let currentUser = [...users];
          currentUser.push({ id: resultSet.insertId, name: name });
          setUsers(currentUser);
          setName("");
          setAge("");
          setHeight("");
          setFeet("");
          setInch("");
          setWeight("")
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  return (
    <ScrollView>
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{textAlign: "center", color: "#800000", fontSize: 20}}>ADD NEW USER</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "#800000",
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
          borderColor: "#800000",
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
          borderColor: "#800000",
        }}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={toggleWeightUnit}
          style={{
            marginRight: 10,
            padding: 10,
            backgroundColor: weightUnit ? "lightgray" : "orange",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: weightUnit ? "black" : "white" }}>Kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleWeightUnit}
          style={{
            padding: 10,
            backgroundColor: weightUnit ? "orange" : "lightgray",
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
                borderColor: "#800000",
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
                borderColor: "#800000",
              }}
            />
          </View>
        ) : (
          <TextInput
            placeholder="Height(cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={{ padding: 10, borderWidth: 1, borderColor: "#800000" }}
          />
        )}
      </View>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity
          onPress={toggleHeightUnit}
          style={{
            marginRight: 10,
            padding: 10,
            backgroundColor: heightUnit ? "lightgray" : "orange",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: heightUnit ? "black" : "white" }}>cm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleHeightUnit}
          style={{
            padding: 10,
            backgroundColor: heightUnit ? "orange" : "lightgray",
            borderRadius: 5,
          }}
        >
          <Text style={{ color: heightUnit ? "white" : "black" }}>ft-in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "orange", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>
  
       <Text style={{textAlign: "center", color: "#800000", fontSize: 20, margin: 10}}>OR CONTINUE AS</Text>
       <View>
        {users.map((item)=>{
          return(
            <View key={item.id}>
                <TouchableOpacity onPress={() => navigation.navigate("Dashboard", {userID: item.id})}>
                  <Text style={{color: "white", margin: 5, padding: 5, textAlign: "center", backgroundColor: "#800000", fontSize: 20, elevation: 5}}>{item.name}</Text>
                </TouchableOpacity>
            </View>
          )
        })}
       </View>
    </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Med Logger"
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
          name="Med Logger"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            title: "Med Logger",
            headerStyle: {
              backgroundColor: "#800000",
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
          name="Image"
          component={Display}
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
