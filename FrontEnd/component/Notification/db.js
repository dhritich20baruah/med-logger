import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("med-logger2.db");

export const fetchPills = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM medicine_list",
        null,
        (txObj, resultSet) => {
          resolve(resultSet.rows._array);
          console.log(resultSet.rows._array)
        },
        (txObj, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });
}
