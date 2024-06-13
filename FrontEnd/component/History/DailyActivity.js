import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import * as SQLite from "expo-sqlite";

export default function DailyActivity({navigation, route}){
    const {data, selected} = route.params
    console.log(selected, data)
    return(
        <View>
            <Text>Your activity on </Text>
        </View>
    )
}