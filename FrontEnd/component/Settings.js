import React, { useState, useMemo } from "react";
import { Text, View, StyleSheet, Alert, Button, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

export default function Settings(){
    return(
    <View>
        <Text>Settings</Text>
        <TouchableOpacity>
            <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text>Export your data</Text>
        </TouchableOpacity>
    </View>
    )
}