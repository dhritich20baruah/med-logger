import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system'
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("med-logger.db");

const DeleteDatabaseScreen = () => {
  const deleteDatabase = async () => {
    try {
      // Specify the path to the database file
      FileSystemPath = async () => {
        console.log(FileSystem.documentDirectory)   
        }
      const dbPath = FileSystem.documentDirectory + 'med-logger.db';
      console.log(FileSystem.documentDirectory) 
      // Check if the database file exists
      const dbExists = await FileSystem.getInfoAsync(dbPath);

      // If the database file exists, delete it
      if (dbExists.exists) {
        await FileSystem.deleteAsync(dbPath);
        console.log('Database deleted successfully');
      } else {
        console.log('Database does not exist');
      }
    } catch (error) {
      console.error('Error deleting database:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete Database</Text>
      <Button title="Delete Database" onPress={deleteDatabase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default DeleteDatabaseScreen;
