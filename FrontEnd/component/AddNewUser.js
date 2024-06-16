import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";

export default function AddNewUser(){



  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20}}>
        <Text style={{ textAlign: "center", color: "#800000", fontSize: 20 }}>
          ADD NEW USER
        </Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#800000",
          }}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={{
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#800000",
          }}
        />
        <Text style={{ marginBottom: 5 }}>
          Weight ({weightUnit ? "lb" : "kg"})
        </Text>
        <TextInput
          placeholder={`Weight (${weightUnit ? "lb." : "kg."})`}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={{
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#800000",
          }}
        />
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={toggleWeightUnit}
            style={{
              marginRight: 10,
              padding: 10,
              backgroundColor: weightUnit ? "lightgray" : "orange",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: weightUnit ? "black" : "white" }}>Kg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleWeightUnit}
            style={{
              padding: 10,
              backgroundColor: weightUnit ? "orange" : "lightgray",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: weightUnit ? "white" : "black" }}>lb.</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ marginBottom: 5 }}>
            Height ({heightUnit ? "ft-in" : "cm"})
          </Text>
          {heightUnit ? (
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Feet"
                value={feet}
                onChangeText={setFeet}
                keyboardType="numeric"
                style={{
                  marginRight: 10,
                  flex: 1,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#800000",
                }}
              />
              <TextInput
                placeholder="Inches"
                value={inch}
                onChangeText={setInch}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#800000",
                }}
              />
            </View>
          ) : (
            <TextInput
              placeholder="Height(cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={{ padding: 10, borderWidth: 1, borderColor: "#800000" }}
            />
          )}
        </View>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={toggleHeightUnit}
            style={{
              marginRight: 10,
              padding: 10,
              backgroundColor: heightUnit ? "lightgray" : "orange",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: heightUnit ? "black" : "white" }}>cm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleHeightUnit}
            style={{
              padding: 10,
              backgroundColor: heightUnit ? "orange" : "lightgray",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: heightUnit ? "white" : "black" }}>ft-in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>
           Please enter your approximate times for having breakfast, lunch, and
           dinner for the medicine tracker.
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
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{ backgroundColor: "orange", padding: 10, borderRadius: 5 }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "800",
            }}
          >
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  });