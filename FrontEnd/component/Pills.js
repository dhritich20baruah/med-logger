import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
  Modal,
  Button,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";
import FontAwesome from "@expo/vector-icons/FontAwesome6";

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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [medicineDetails, setMedicineDetails] = useState([]);

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
        "CREATE TABLE IF NOT EXISTS medicine_list (id INTEGER PRIMARY KEY AUTOINCREMENT, medicineName TEXT, startDate TEXT, endDate TEXT, sunday INTEGER, monday INTEGER, tuesday INTEGER, wednesday INTEGER, thursday INTEGER, friday INTEGER, saturday INTEGER, BeforeBreakfast TEXT, AfterBreakfast TEXT, BeforeLunch TEXT, AfterLunch TEXT, BeforeDinner TEXT, AfterDinner TEXT, user_id INTEGER)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM meal_timings_test WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => {
          if (resultSet.rows._array.length >= 1) {
            setTimingsAvailable(true);
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
        },
        (txObj, error) => console.log(error)
      );
    });
  }, []);

  // Memoized Item Component
  const MemoizedItem = React.memo(({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => modalInfo(item.id)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  ));

  // Function to transform the data
  const transformData = (data) => {
    const items = {};

    data.forEach((entry) => {
      const startDate = new Date(entry.startDate);
      const endDate = new Date(entry.endDate);
      const medicineName = entry.medicineName;
      const medId = entry.id;

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

          items[dateString].push({ name: medicineName, id: medId });
        }
      }
    });

    return items;
  };

  // Transformed data
  const agendaItems = transformData(medicineData);

  const renderItem = useCallback(
    (item, isFirst) => <MemoizedItem item={item} />,
    []
  );

  const renderEmptyDate = useCallback(
    () => (
      <View style={styles.emptyDate}>
        <Text>No medication for today</Text>
      </View>
    ),
    []
  );

  // MODAL FUNCTION
  const modalInfo = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM medicine_list WHERE id = ? AND user_id = ?",
        [id, userID],
        (txObj, resultSet) => {
          if (resultSet.rows._array.length > 0) {
            const selectedMedicine = resultSet.rows._array[0];
            setMedicineDetails(selectedMedicine);
            setModalVisible(true);
          } else {
            console.log("No medicine found with the given id");
          }
        },
        (txObj, error) => console.log("Error fetching medicine details:", error)
      );
    });
  };

  // DELETE MEDICINE
  const deleteMed = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM medicine_list WHERE id=?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            Alert.alert("Medicine is removed");
            // Update the state by filtering out the deleted medicine
            setMedicineData((prevMedicineData) =>
              prevMedicineData.filter((medicine) => medicine.id !== id)
            );
            // Close the modal
            setModalVisible(false);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  //EDIT MEDICATION
  const EditMedicine = () => {
    setModalVisible(false)
    navigation.navigate("Edit Medication", {
      userID,
      medicineDetails,
      timings
    })
  }

  if (timingsAvailable) {
    return (
      <SafeAreaView style={styles.container}>
        <Agenda
          selected={selectedDate}
          items={
            agendaItems[selectedDate]
              ? { [selectedDate]: agendaItems[selectedDate] }
              : {}
          }
          onDayPress={(day) => setSelectedDate(day.dateString)}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          markingType={"dot"}
          rowHasChanged={(r1, r2) => r1.name !== r2.name}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalView}>
            <View
              style={styles.modalBtns}
            >
              <TouchableOpacity style={{ margin: 10 }}>
                <FontAwesome
                  name="trash-can"
                  size={25}
                  color="#800000"
                  onPress={() => deleteMed(medicineDetails.id)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={EditMedicine}
              >
                <FontAwesome name="pen-to-square" size={25} color="#800000" />
              </TouchableOpacity>
            </View>
            <View>
              {medicineDetails && (
                <View>
                  <Text style={styles.modalTitle}>
                    {medicineDetails.medicineName}
                  </Text>
                  <Text style={styles.modalText}>
                    You need to take this medicine-
                  </Text>
                  <View>
                    {medicineDetails.BeforeBreakfast ? (
                      <Text style={styles.modalText}>
                        Before Breakfast: {medicineDetails.BeforeBreakfast}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                  <View>
                    {medicineDetails.AfterBreakfast ? (
                      <Text style={styles.modalText}>
                        After Breakfast: {medicineDetails.AfterBreakfast}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                  <View>
                    {medicineDetails.BeforeLunch ? (
                      <Text style={styles.modalText}>
                        Before Lunch: {medicineDetails.BeforeLunch}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                  <View>
                    {medicineDetails.AfterLunch ? (
                      <Text style={styles.modalText}>
                        After Lunch: {medicineDetails.AfterLunch}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                  <View>
                    {medicineDetails.BeforeDinner ? (
                      <Text style={styles.modalText}>
                        Before Dinner: {medicineDetails.BeforeDinner}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                  <View>
                    {medicineDetails.AfterDinner ? (
                      <Text style={styles.modalText}>
                        After Dinner: {medicineDetails.AfterDinner}
                      </Text>
                    ) : (
                      <View></View>
                    )}
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.saveBtnContainer}
            >
              <Text style={styles.saveBtn}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  emptyDate: {
    height: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
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
  saveBtnContainer: {
    margin: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#800000",
    elevation: 25,
  },
  saveBtn: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
