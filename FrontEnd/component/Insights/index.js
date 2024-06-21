import * as React from "react";
import { useState, useEffect, useRef } from "react";
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

export default function Insights() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Blood Pressure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Blood Sugar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Liver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Thyroid</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Heart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Kidney</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 10
  },
  btn: {
    margin: 10,
    backgroundColor: '#fffecc',
    padding: 20,
    borderRadius: 15
  },
  btnText: {
    // margin: 10,
    // backgroundColor: '#fffecc',
    // width: '100%',
    // padding: 20,
    // borderRadius: 15,
    fontWeight: 'bold',
    fontSize: 18,
    color: "#800000"
  }
});
