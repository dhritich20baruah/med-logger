import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
export default function AddMedicine(){
    return(
        <View>
            <Text>Set Start date</Text>
            <Text>How long will you be taking this medicine?</Text>
            <Text>Type of medicine</Text>
            <Text>Set doses</Text>
            <Text>Dose Timing</Text>
        </View>
    )
}