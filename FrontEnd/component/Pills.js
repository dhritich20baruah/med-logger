import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import CalendarScreen from "./CalendarScreen";

export default function Pills(){
    return(
        <View style={{display: 'flex', flexDirection: 'row'}}>
            <CalendarScreen/>
        </View>
    )
}