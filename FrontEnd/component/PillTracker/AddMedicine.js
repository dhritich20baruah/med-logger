import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default function AddMedicine({navigation, route}) {
  const { userID } = route.params;

  const [medicineName, setMedicineName] = useState("")
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [days, setDays] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const [timing, setTiming] = useState({
    BeforeBreakfast: false,
    AfterBreakfast: false,
    BeforeLunch: false,
    AfterLunch: false,
    BeforeDinner: false,
    AfterDinner: false,
  });

  const [allSelected, setAllSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState("January");

  const daysWeeksMonths = ["Days", "Weeks", "Months"];

  const NumsArray = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleDays = (key) => {
    setDays((prevSelections) => ({
      ...prevSelections,
      [key]: !prevSelections[key],
    }));
  };

  const handleSelectEveryday = () => {
    const newSelections = Object.keys(days).reduce((acc, key) => {
      acc[key] = !allSelected;
      return acc;
    }, {});
    setDays(newSelections);
    setAllSelected(!allSelected);
  };

  const handleTiming = (key) => {
    setTiming((prevSelections) => ({
      ...prevSelections,
      [key]: !prevSelections[key],
    }));
  };

  const toggleShowDate = () => {
    setShowDate(!showDate);
  };

  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
    toggleShowDate();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* MEDICINE NAME */}
        <Text style={styles.textStyle}>
          Medication Name:
        </Text>
        <View>
        <TextInput
          onChangeText={setMedicineName}
          value={medicineName}
          placeholder="Name of the medicine"
          style={styles.inputField}
        />
        </View>

        {/* START DATE */}
        <View>
          <Text style={styles.textStyle}>
            When will you start taking the medicine?
          </Text>
          <TouchableOpacity onPress={toggleShowDate}>
            <Text style={styles.textStyleSecondary}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDate && (
            <DateTimePicker
              value={date}
              mode={"date"}
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}
        </View>

        {/* DURATION OF MEDICATION */}
        <View>
          <Text style={styles.textStyle}>
            How long will you be taking this medicine?
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <ScrollPicker
              dataSource={NumsArray}
              selectedIndex={1}
              onValueChange={(data, selectedIndex) => {
                //
              }}
              wrapperHeight={180}
              wrapperBackground="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              highlightBorderWidth={3}
              style={{ width: 100 }}
            />
            <ScrollPicker
              dataSource={daysWeeksMonths}
              selectedIndex={1}
              onValueChange={(data, selectedIndex) => {
                //
              }}
              wrapperHeight={180}
              wrapperBackground="#FFFFFF"
              itemHeight={60}
              highlightColor="#d8d8d8"
              highlightBorderWidth={3}
              style={{ width: 100 }}
            />
          </View>
        </View>

        {/* MEDICATION SCHEDULE */}
        <Text style={styles.textStyle}>How often do you need to take it?</Text>
        <View style={styles.radioAllBtnContainer}>
        <TouchableOpacity
            style={[allSelected ?
              styles.radioAllBtnSelected :
              styles.radioAllBtn
            ]}
            onPress={handleSelectEveryday}
          >
          </TouchableOpacity>
          <Text style={styles.radioAllBtnText}>Every Day</Text>
        </View>
        <Text style={styles.radioText}>Or on certain days.</Text>
        <View style={styles.radioBtnContainer}>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.sunday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("sunday")}
          >
            <Text style={styles.radioText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.monday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("monday")}
          >
            <Text style={styles.radioText}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.tuesday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("tuesday")}
          >
            <Text style={styles.radioText}>T</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.wednesday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("wednesday")}
          >
            <Text style={styles.radioText}>W</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.thursday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("thursday")}
          >
            <Text style={styles.radioText}>T</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.friday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("friday")}
          >
            <Text style={styles.radioText}>F</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioDayBtn,
              days.saturday && styles.selectedDayBtn,
            ]}
            onPress={() => handleDays("saturday")}
          >
            <Text style={styles.radioText}>S</Text>
          </TouchableOpacity>
        </View>

        {/* MEDICATION TIMINGS */}
        <Text style={styles.textStyle}>
          At what time should you be taking the medicines?
        </Text>
        <View>
          {/* Breakfast */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.BeforeBreakfast && styles.selectedButton,
              ]}
              onPress={() => handleTiming("BeforeBreakfast")}
            >
              <Text style={styles.radioText}>Before Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.AfterBreakfast && styles.selectedButton,
              ]}
              onPress={() => handleTiming("AfterBreakfast")}
            >
              <Text style={styles.radioText}>After Breakfast</Text>
            </TouchableOpacity>
          </View>
          {/* Lunch */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.BeforeLunch && styles.selectedButton,
              ]}
              onPress={() => handleTiming("BeforeLunch")}
            >
              <Text style={styles.radioText}>Before Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.AfterLunch && styles.selectedButton,
              ]}
              onPress={() => handleTiming("AfterLunch")}
            >
              <Text style={styles.radioText}>After Lunch</Text>
            </TouchableOpacity>
          </View>
          {/* Dinner */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.BeforeDinner && styles.selectedButton,
              ]}
              onPress={() => handleTiming("BeforeDinner")}
            >
              <Text style={styles.radioText}>Before Dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing.AfterDinner && styles.selectedButton,
              ]}
              onPress={() => handleTiming("AfterDinner")}
            >
              <Text style={styles.radioText}>After Dinner</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Button title="Add Medicine +" color="orange"/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    width: 350,
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#800000",
    margin: 5,
    padding: 5,
    fontSize: 20
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#800000",
    margin: 10,
    textAlign: "center",
  },
  textStyleSecondary: {
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontFamily: "sans-serif",
    color: "white",
    backgroundColor: "orange",
    padding: 3
  },
  radioAllBtnContainer:{
    display: 'flex',
    flexDirection: 'row',
    margin: 10
  },
  radioAllBtn:{
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#800000",
    marginHorizontal: 15
  },
  radioAllBtnSelected: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginHorizontal: 15,
    backgroundColor: "orange",
    padding: 1,
    elevation: 20
  },
  radioAllBtnText:{
    fontSize: 15,
    color: "#800000"
  },
  radioBtnContainer: {
    display: "flex",
    flexDirection: "row",
  },
  radioButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: "#80000",
    width: 170,
    marginHorizontal: 3,
    marginVertical: 10,
    elevation: 10
  },
  selectedButton: {
    backgroundColor: "orange",
    color: "white",
  },
  radioDayBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    color: "#80000", 
    marginHorizontal: 3,
    marginVertical: 10,
    elevation: 10,
    height: 45,
  },
  selectedDayBtn: {
    backgroundColor: "orange",
    color: "white",
  },
  radioText: {
    fontSize: 16,
    color: "#800000",
    textAlign: "center",
  },
});
