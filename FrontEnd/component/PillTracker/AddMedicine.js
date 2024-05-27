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

export default function AddMedicine() {
  const [timing, setTiming] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [selectedValue, setSelectedValue] = useState("January");
  const daysWeeksMonths = ["Days", "Weeks", "Months"];

  const NumsArray = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleTiming = (option) => {
    setTiming(option);
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
        <Text>Type of medicine</Text>
        <Text>Set doses</Text>
        <Text style={styles.textStyle}>At what time should you be taking the medicines?</Text>
        <View>
          {/* Breakfast */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("BeforeBreakfast")}
              >
                Before Breakfast
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("AfterBreakfast")}
              >
                After Breakfast
              </Text>
            </TouchableOpacity>
          </View>
          {/* Lunch */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("BeforeLunch")}
              >
                Before Lunch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("AfterLunch")}
              >
                After Lunch
              </Text>
            </TouchableOpacity>
          </View>
          {/* Dinner */}
          <View style={styles.radioBtnContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("BeforeDinner")}
              >
                Before Dinner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                timing === "Fasting" && styles.selectedButton,
              ]}
            >
              <Text
                style={styles.radioText}
                onPress={() => handleTiming("AfterDinner")}
              >
                After Dinner
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  textStyle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#800000",
    margin: 10,
    textAlign: 'center'
  },
  textStyleSecondary: {
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontFamily: "sans-serif",
  },
  radioBtnContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  radioButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#80000",
    width: 170,
  },
  selectedButton: {
    backgroundColor: "orange",
    color: "white",
  },
  radioText: {
    fontSize: 16,
    color: "#800000",
    textAlign: "center"
  },
});
