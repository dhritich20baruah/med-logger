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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddMedicine() {
  const [timing, setTiming] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const handleTiming = (option) => {
    setTiming(option);
  };

  const toggleShowDate = () => {
    setShowDate(!showDate);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleShowDate();
        setStartDate(currentDate.toDateString());
      }
    } else {
      toggleShowDate();
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.textStyle}>Set Start date</Text>
          {!showDate && (
            <DateTimePicker
              value={date}
              mode={"date"}
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}

            <Pressable onPress={toggleShowDate} style={{backgroundColor: "red"}}>
              <TextInput
                onChangeText={setDate}
                value={setStartDate}
                // editable={false}
              />
            </Pressable>
        
        </View>
        <Text>How long will you be taking this medicine?</Text>
        <Text>Type of medicine</Text>
        <Text>Set doses</Text>
        <Text>Dose Timing</Text>
        <View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#800000",
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
});
