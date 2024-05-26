import React, {useState} from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AddMedicine from "./PillTracker/AddMedicine";
export default function Pills(){
    return(
        <View style={{display: 'flex', flexDirection: 'row'}}>
            <AddMedicine/>
        </View>
    )
}