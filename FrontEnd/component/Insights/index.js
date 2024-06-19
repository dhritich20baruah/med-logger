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
  Button
} from "react-native";

export default function Insights(){
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ScrollView>
            <Text>Insights</Text>
            </ScrollView>
        </View>
    )
}