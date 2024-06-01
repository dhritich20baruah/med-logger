import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";

export default function Pills({ navigation, route }) {
  const { userID } = route.params;
  const [timingsAvailable, setTimingsAvailable] = useState(false);
  const [time, setTime] = useState(new Date());
  const [breakfast, setBreakfast] = useState();
  const [lunch, setLunch] = useState();
  const [dinner, setDinner] = useState();
  const [visible, setVisible] = useState(false)
  
  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [mealTimings, setMealTimings] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const onChange = (e, selectedDate) => {
    setTime(selectedDate);
    setVisible(!visible)
    console.log(getFormattedTime(time))
  };

  const getFormattedTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handlePress = (meal) => {
    setSelectedMeal(meal);
    setVisible(!visible)
  };

  const handleSave = (time) => {
    setMealTimings({
      ...mealTimings,
      [selectedMeal]: time,
    });
  };

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "CREATE TABLE IF NOT EXISTS meal_timings_test (id INTEGER PRIMARY KEY AUTOINCREMENT, breakfast TEXT, lunch TEXT, dinner TEXT)"
  //     );
  //   });

  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "SELECT * FROM meal_timings_test",
  //       null,
  //       (txObj, resultSet) => {
  //         if(resultSet.rows._array.length !== 0){
  //           setTimingsAvailable(true)
  //         };
  //       },
  //       (txObj, error) => console.log(error)
  //     );
  //   });
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!timingsAvailable ? (
        <View>
          <Text style={styles.title}>Meal Timings</Text>

          <TouchableOpacity
            onPress={() => handlePress("breakfast")}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {mealTimings.breakfast || "Set Breakfast Time"} {getFormattedTime(time)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePress("lunch")}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {mealTimings.lunch || "Set Lunch Time"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePress("dinner")}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {mealTimings.dinner || "Set Dinner Time"}
            </Text>
          </TouchableOpacity>
          {
            visible &&
            <DateTimePicker
            value={time}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChange}
            />
          }
        </View>
      ) : (
        <View>
          <Agenda
            selected="2024-06-01"
            items={{
              "2024-06-01": [
                { name: "Cycling" },
                { name: "Walking" },
                { name: "Running" },
              ],
              "2024-06-01": [{ name: "Writing" }],
            }}
            renderItem={(item, isFirst) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            renderEmptyDate={() => (
              <View style={styles.emptyDate}>
                <Text>No Events</Text>
              </View>
            )}
            rowHasChanged={(r1, r2) => r1.name !== r2.name}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Add Medicine", { userID })}
            style={styles.floatBtn}
          >
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#888",
    fontSize: 16,
  },
  floatBtn: {
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    position: "absolute",
    borderRadius: 50,
    top: 650,
    right: 30,
  },
  btnText: {
    color: "white",
    fontSize: 30,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 16,
  },
  inputText: {
    fontSize: 18,
    color: "#333",
  },
});
