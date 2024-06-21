import React, { useState, useMemo, useEffect } from "react";
import { Text, View, StyleSheet, Alert, Button, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

//DATABASE
const db = SQLite.openDatabase("med-logger2.db");

export function Profile({userID}){
    const [users, setUsers] = useState([])

    useEffect(()=>{
        db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM userData WHERE id = ?",
              [userID],
              (txObj, resultSet) => {
                setUsers(resultSet.rows._array);
                console.log(resultSet.rows._array)
              },
              (txObj, error) => console.log(error)
            );
          });
    }, [])
    return(
        <View style={styles.profileContainer}>
            <Text style={styles.profileText}>{users[0].name}</Text>
            <Text style={styles.profileText2}>{users[0].age} Years | {users[0].height} cm | {users[0].weight} kg</Text>
            <Text style={styles.profileText2}>Breakfast Time: {users[0].breakfast} hrs</Text>
            <Text style={styles.profileText2}>Lunch Time: {users[0].lunch} hrs</Text>
            <Text style={styles.profileText2}>Dinner Time: {users[0].dinner} hrs</Text>
        </View>
    )
}

// export function EditProfile(){

// }

const styles = StyleSheet.create({
    profileContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    profileText: {
        fontSize: 16,
        margin: 2,
        fontWeight: '700',
        color: 'gray'
    },
    profileText2: {
        fontSize: 16,
        margin: 2,
        fontWeight: '400',
        color: 'gray'
    }
})