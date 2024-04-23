import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome6'
const Dashboard = () => {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <FontAwesome name='heart-pulse' size={50} color="#43464b"/>
          </View>
          <View style={styles.cell}>
          <FontAwesome name='droplet' size={50} color="#43464b"/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
          <FontAwesome name='x-ray' size={50} color="#43464b"/>
          </View>
          <View style={styles.cell}>
          <FontAwesome name='pills' size={50} color="#43464b"/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
          <FontAwesome name='user-doctor' size={50} color="#43464b"/>
          </View>
          <View style={styles.cell}>
          <FontAwesome name='calendar-days' size={50} color="#43464b"/>
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cell: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    margin: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
});

export default Dashboard