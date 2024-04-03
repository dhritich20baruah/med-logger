import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, ImageBackground } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeWindStyleSheet } from "nativewind";
import { handleSubmit } from "./storage";
import Storage from "./storage";

NativeWindStyleSheet.setOutput({
  default: "native",
});

function HomeScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleFormSubmit = () => {
    handleSubmit(name, age, height, weight)
  }

  return (  
    <View className="flex-1 p-5 space-y-2">
      <Text className="text-lg">Name</Text>
      <TextInput
        className="h-14 border-2 border-indigo-600 rounded-md outline-none p-2"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text className="text-lg">Age (year)</Text>
      <TextInput
       className="h-14 border-2 border-indigo-600 rounded-md outline-none p-2"
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
      />
      <Text className="text-lg">Height (cm)</Text>
      <TextInput
        className="h-14 border-2 border-indigo-600 rounded-md outline-none p-2"
        value={height}
        onChangeText={setHeight}
        placeholder="Enter your height"
        keyboardType="numeric"
      />
      <Text className="text-lg">Weight (kg)</Text>
      <TextInput
        className="h-14 border-2 border-indigo-600 rounded-md outline-none p-2 mb-3"
        value={weight}
        onChangeText={setWeight}
        placeholder="Enter your weight"
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleFormSubmit} style={{backgroundColor: 'red'}}/>
      <View className="h-[25%] flex-1 items-center justify-center">
        <Storage/>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation, route }) => ({
            title: "Home",
            headerStyle: {
              backgroundColor: "#6D5ACF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            }
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


