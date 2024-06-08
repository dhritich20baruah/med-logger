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

export default function UpdateMedication({ route }) {
    let {medStartDate} = route.params

  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(medStartDate);

  // DATE PICKER
  const toggleShowDate = () => {
    setShowDate(!showDate);
  };

  const handleDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    let dateString = selectedDate.toISOString();
    let formattedDate = dateString.slice(0, dateString.indexOf("T"));

    setDate(currentDate);
    setStartDate(formattedDate);
    toggleShowDate();
  };

  return (
    <View>
      <Text style={styles.textStyle}>
        When did you start taking the medicine?
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
          onChange={handleDate}
        />
      )}
    </View>
  );
}
