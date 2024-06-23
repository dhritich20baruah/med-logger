import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Modal,
  Platform,
  Button,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import Dashboard from "./component/Dashboard";
import BloodPressure from "./component/BloodPressure";
import BloodSugar from "./component/BloodSugar";
import Diagnostic from "./component/Diagnostics";
import Pills from "./component/Pills";
import Doctors from "./component/Doctors";
import History from "./component/History";
import Display from "./component/Diagnotics/Display";
import AddMedicine from "./component/PillTracker/AddMedicine";
import EditMedicine from "./component/PillTracker/EditMedicine";
import AddDoctor from "./component/Doctors/AddDoctor";
import EditDoctor from "./component/Doctors/EditDoctor";
import CameraFunction from "./component/Diagnotics/CameraFunction";
import DailyActivity from "./component/History/DailyActivity";
import Settings from "./component/Settings";
import EditProfile from "./component/Settings/EditProfile";

//DATABASE
const db = SQLite.openDatabase("med-logger2.db");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function HomeScreen({ navigation, route }) {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inch, setInch] = useState("");
  const [heightUnit, setHeightUnit] = useState(false);
  const [weightUnit, setWeightUnit] = useState(false);
  const [breakfast, setBreakfast] = useState(new Date());
  const [lunch, setLunch] = useState(new Date());
  const [dinner, setDinner] = useState(new Date());
  const [visibleBreakfast, setVisibleBreakfast] = useState(false);
  const [visibleLunch, setVisibleLunch] = useState(false);
  const [visibleDinner, setVisibleDinner] = useState(false);

  const toggleWeightUnit = () => {
    setWeightUnit((prevState) => !prevState);
  };

  const toggleHeightUnit = () => {
    setHeightUnit((prevState) => !prevState);
  };

  const onChangeBreakfast = (e, selectedDate) => {
    setBreakfast(selectedDate);
    setVisibleBreakfast(!visibleBreakfast);
  };

  const onChangeLunch = (e, selectedDate) => {
    setLunch(selectedDate);
    setVisibleLunch(!visibleLunch);
  };

  const onChangeDinner = (e, selectedDate) => {
    setDinner(selectedDate);
    setVisibleDinner(!visibleDinner);
  };

  const getFormattedTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, weight REAL, height REAL, breakfast TEXT, lunch TEXT, dinner TEXT)"
      );
    }); 
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM userData",
        null,
        (txObj, resultSet) => {
          setUsers(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const image = require("./assets/Background.png");

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

    //Timings
    let breakfastTime = getFormattedTime(breakfast);
    let lunchTime = getFormattedTime(lunch);
    let dinnerTime = getFormattedTime(dinner);

    // Handle form submission
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO userData (name, age, weight, height, breakfast, lunch, dinner) values (?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          age,
          weightResult,
          heightResult,
          breakfastTime,
          lunchTime,
          dinnerTime,
        ],
        (txObj, resultSet) => {
          let currentUser = [...users];
          currentUser.push({ id: resultSet.insertId, name: name });
          setUsers(currentUser);
          setName("");
          setAge("");
          setHeight("");
          setFeet("");
          setInch("");
          setWeight("");
          setModalVisible(false);
          Alert.alert("New User Added");
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.content}>
          {users.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Dashboard", { userID: item.id })
                }
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addButtonContainer}
          >
            <Text style={styles.addButtonText}>Add New User</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <ScrollView>
              <View style={{ flex: 1, padding: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#800000",
                    fontSize: 15,
                  }}
                >
                  ADD NEW USER
                </Text>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={{
                    marginBottom: 10,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#800000",
                    borderRadius: 10,
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
                    borderRadius: 10,
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
                    borderRadius: 10,
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
                    <Text style={{ color: weightUnit ? "black" : "white" }}>
                      Kg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleWeightUnit}
                    style={{
                      padding: 10,
                      backgroundColor: weightUnit ? "orange" : "lightgray",
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: weightUnit ? "white" : "black" }}>
                      lb.
                    </Text>
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
                          borderRadius: 10,
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
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  ) : (
                    <TextInput
                      placeholder="Height(cm)"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="numeric"
                      style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "#800000",
                        borderRadius: 10,
                      }}
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
                    <Text style={{ color: heightUnit ? "black" : "white" }}>
                      cm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleHeightUnit}
                    style={{
                      padding: 10,
                      backgroundColor: heightUnit ? "orange" : "lightgray",
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: heightUnit ? "white" : "black" }}>
                      ft-in
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.container}>
                  <Text style={styles.title}>
                    Please enter your approximate times for having breakfast,
                    lunch, and dinner for the medicine tracker.
                  </Text>

                  {/* Breakfast */}
                  <TouchableOpacity
                    onPress={() => setVisibleBreakfast(!visibleBreakfast)}
                    style={styles.input}
                  >
                    <Text style={styles.inputText}>Set Breakfast Time</Text>
                    <Text style={styles.inputTime}>
                      {getFormattedTime(breakfast)}
                    </Text>
                  </TouchableOpacity>
                  {visibleBreakfast && (
                    <DateTimePicker
                      value={breakfast}
                      mode={"time"}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeBreakfast}
                    />
                  )}

                  {/* Lunch */}
                  <TouchableOpacity
                    onPress={() => setVisibleLunch(!visibleLunch)}
                    style={styles.input}
                  >
                    <Text style={styles.inputText}>Set Lunch Time</Text>
                    <Text style={styles.inputTime}>
                      {getFormattedTime(lunch)}
                    </Text>
                  </TouchableOpacity>
                  {visibleLunch && (
                    <DateTimePicker
                      value={lunch}
                      mode={"time"}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeLunch}
                    />
                  )}

                  {/* Dinner */}
                  <TouchableOpacity
                    onPress={() => setVisibleDinner(!visibleDinner)}
                    style={styles.input}
                  >
                    <Text style={styles.inputText}>Set Dinner Time</Text>
                    <Text style={styles.inputTime}>
                      {getFormattedTime(dinner)}
                    </Text>
                  </TouchableOpacity>
                  {visibleDinner && (
                    <DateTimePicker
                      value={dinner}
                      mode={"time"}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeDinner}
                    />
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "orange",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "800",
                    }}
                  >
                    SUBMIT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                >
                  <Text style={styles.cancelText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [pillTimings, setPillTimings] = useState([]);

  useEffect(() => {
    //CREATE MEDICINE LIST TABLE
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS medicine_list (id INTEGER PRIMARY KEY AUTOINCREMENT, medicineName TEXT, startDate TEXT, endDate TEXT, sunday INTEGER, monday INTEGER, tuesday INTEGER, wednesday INTEGER, thursday INTEGER, friday INTEGER, saturday INTEGER, BeforeBreakfast TEXT, AfterBreakfast TEXT, BeforeLunch TEXT, AfterLunch TEXT, BeforeDinner TEXT, AfterDinner TEXT, user_id INTEGER)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM medicine_list",
        null,
        (txObj, resultSet) => {
          setPillTimings(resultSet.rows._array);
          // console.log(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  useEffect(()=>{
    schedulePushNotification(pillTimings);
  }, [])

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
          name="Camera"
          component={CameraFunction}
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
          name="Add Medicine"
          component={AddMedicine}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Edit Medication"
          component={EditMedicine}
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
          name="Add Doctor Information"
          component={AddDoctor}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Edit Doctor Information"
          component={EditDoctor}
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
        <Stack.Screen
          name="Day's Activity"
          component={DailyActivity}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={() => ({
            headerStyle: {
              backgroundColor: "#800000",
            },
          })}
        />
          <Stack.Screen
          name="Edit Profile"
          component={EditProfile}
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

async function schedulePushNotification(medications) {
  const now = new Date();

  for (const med of medications) {
    const startDate = new Date(med.startDate);
    const endDate = new Date(med.endDate);

    // Check if the current date is within the medication period
    if (now >= startDate && now <= endDate) {
      const daysOfWeek = [
        med.sunday,
        med.monday,
        med.tuesday,
        med.wednesday,
        med.thursday,
        med.friday,
        med.saturday,
      ];

      // Get today's day of the week (0-6 where 0 is Sunday)
      const today = now.getDay();

      if (daysOfWeek[today]) {
        // Schedule notifications for the relevant times
        const times = [
          { time: med.BeforeBreakfast, label: "Before Breakfast" },
          { time: med.AfterBreakfast, label: "After Breakfast" },
          { time: med.BeforeLunch, label: "Before Lunch" },
          { time: med.AfterLunch, label: "After Lunch" },
          { time: med.BeforeDinner, label: "Before Dinner" },
          { time: med.AfterDinner, label: "After Dinner" },
        ];

        for (const { time, label } of times) {
          if (time) {
            const [hours, minutes] = time.split(":").map(Number);
            const notificationTime = new Date(now);
            notificationTime.setHours(hours, minutes, 0, 0);

            // Only schedule future notifications
            if (notificationTime > now) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `Time to take your medication: ${med.medicineName}`,
                  body: `${label} - ${med.medicineName}`,
                },
                trigger: {
                  seconds: (notificationTime.getTime() - now.getTime()) / 1000,
                },
              });
            }
          }
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    padding: 20,
  },
  itemContainer: {
    marginVertical: 10,
  },
  itemText: {
    color: "#800000",
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 15,
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 25,
    fontWeight: "500",
    elevation: 15,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    width: 350,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: "#800000",
  },
  modalTitle: {
    margin: 5,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#800000",
  },
  modalText: {
    margin: 5,
    textAlign: "center",
    fontSize: 15,
    color: "#800000",
  },
  addButtonContainer: {
    margin: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    elevation: 20,
    color: "white",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
  },
  title: {
    margin: 5,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputText: {
    color: "#333",
  },
  inputTime: {
    fontWeight: "bold",
    color: "#800000",
  },
  cancelText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
  },
});
