import * as SQLite from 'expo-sqlite'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
    default: "native",
  });

export default function Storage(){
    const db = SQLite.openDatabase('example.db')
    const [isLoading, setIsLoading] = useState(true)

    if(isLoading){
        return(
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-600">Loading...</Text>
            </View>
        )
    }
}


export const handleSubmit = async (name, age, height, weight) => {
    try {
       console.log(name, age, height, weight)

        alert('Data Saved')
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

