// CalendarScreen.js
import React, { useState } from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        selected="2022-12-01"
        items={{
          '2022-12-01': [{name: 'Cycling'}, {name: 'Walking'}, {name: 'Running'}],
          '2022-12-02': [{name: 'Writing'}]
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedDateText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CalendarScreen;
