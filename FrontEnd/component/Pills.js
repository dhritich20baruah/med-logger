import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";

export default function Pills({ navigation, route }) {
  const { userID } = route.params;
  const [timingsAvailable, setTimingsAvailable] = useState(false);
  const [breakfast, setBreakfast] = useState(new Date());
  const [lunch, setLunch] = useState(new Date());
  const [dinner, setDinner] = useState(new Date());
  const [timings, setTimings] = useState([]);
  const [visibleBreakfast, setVisibleBreakfast] = useState(false);
  const [visibleLunch, setVisibleLunch] = useState(false);
  const [visibleDinner, setVisibleDinner] = useState(false);
  const [medicineData, setMedicineData] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  //DATABASE
  const db = SQLite.openDatabase("med-logger2.db");

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

  const handleSave = () => {
    let breakfastTime = getFormattedTime(breakfast);
    let lunchTime = getFormattedTime(lunch);
    let dinnerTime = getFormattedTime(dinner);

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO meal_timings_test (breakfast, lunch, dinner, user_id) values (?, ?, ?, ?)",
        [breakfastTime, lunchTime, dinnerTime, userID],
        (txObj, resultSet) => {
          Alert.alert("Timings saved");
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS meal_timings_test (id INTEGER PRIMARY KEY AUTOINCREMENT, breakfast TEXT, lunch TEXT, dinner TEXT, user_id INTEGER)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM meal_timings_test WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          if (resultSet.rows._array.length >= 1) {
            setTimingsAvailable(!timingsAvailable);
            setTimings(resultSet.rows._array);
          }
        },
        (txObj, error) => console.log(error)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM medicine_list WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          setMedicineData(resultSet.rows._array);
          console.log(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  // Function to transform the data
  const transformData = (data) => {
    const items = {};

    data.forEach((entry) => {
      const startDate = new Date(entry.startDate);
      const endDate = new Date(entry.endDate);
      const medicineName = entry.medicineName;

      // Loop through each day from startDate to endDate
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split("T")[0];

        // Check if the medicine is taken on this day
        if (
          (dayOfWeek === 0 && entry.sunday) ||
          (dayOfWeek === 1 && entry.monday) ||
          (dayOfWeek === 2 && entry.tuesday) ||
          (dayOfWeek === 3 && entry.wednesday) ||
          (dayOfWeek === 4 && entry.thursday) ||
          (dayOfWeek === 5 && entry.friday) ||
          (dayOfWeek === 6 && entry.saturday)
        ) {
          if (!items[dateString]) {
            items[dateString] = [];
          }

          items[dateString].push({ name: medicineName });
        }
      }
    });

    return items;
  };

  // Transformed data
  const agendaItems = transformData(medicineData);

  if (timingsAvailable) {
    return (
      <SafeAreaView style={styles.container}>
        <Agenda
          selected={today}
          items={agendaItems}
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
          onPress={() =>
            navigation.navigate("Add Medicine", { userID, timings })
          }
          style={styles.floatBtn}
        >
          <Text style={styles.btnText}>Add Medicine +</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {" "}
          Please enter your approximate times for having breakfast, lunch, and
          dinner before adding medicines to your medicine tracker.
        </Text>

        {/* Breakfast */}
        <TouchableOpacity
          onPress={() => setVisibleBreakfast(!visibleBreakfast)}
          style={styles.input}
        >
          <Text style={styles.inputText}>Set Breakfast Time</Text>
          <Text style={styles.inputTime}>{getFormattedTime(breakfast)}</Text>
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
          <Text style={styles.inputTime}>{getFormattedTime(lunch)}</Text>
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
          <Text style={styles.inputTime}>{getFormattedTime(dinner)}</Text>
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
        <TouchableOpacity onPress={handleSave} style={styles.saveBtnContainer}>
          <Text style={styles.saveBtn}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#800000",
    position: "absolute",
    borderRadius: 10,
    top: 650,
    right: 30,
    padding: 3,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    padding: 3,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontSize: 18,
    margin: 15,
    textAlign: "center",
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
    fontSize: 18,
    color: "#333",
  },
  inputTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#800000",
  },
  saveBtnContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "orange",
  },
  saveBtn: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
