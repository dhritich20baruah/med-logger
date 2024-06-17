// import * as Notifications from 'expo-notifications';
// import * as TaskManager from 'expo-task-manager';

// async function scheduleNotification(time, message, id) {
//   const trigger = new Date(time);
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Medicine Reminder',
//       body: message,
//     },
//     trigger,
//     identifier: id,
//   });
// }

// const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
//   // Fetch medicines from the database
//   const medicines = await fetchPills(); // You need to modify this function to return a promise
  
//   // Current date and time
//   const now = new Date();
  
//   medicines.forEach((medicine) => {
//     const { startDate, endDate, AfterBreakfast, AfterLunch, AfterDinner, BeforeBreakfast, BeforeLunch, BeforeDinner } = medicine;

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (now >= start && now <= end) {
//       if (AfterBreakfast) {
//         const afterBreakfastTime = new Date();
//         afterBreakfastTime.setHours(...AfterBreakfast.split(':').map(Number));
//         if (afterBreakfastTime > now) {
//           scheduleNotification(afterBreakfastTime, `Time to take your ${medicine.medicineName} after breakfast`, `${medicine.id}-AfterBreakfast`);
//         }
//       }
//       // Repeat for other times like AfterLunch, AfterDinner, BeforeBreakfast, BeforeLunch, BeforeDinner
//     }
//   });
// });

// // Register the task to be executed in the background
// TaskManager.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// import * as BackgroundFetch from 'expo-background-fetch';

// async function registerBackgroundFetch() {
//   await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
//     minimumInterval: 15 * 60, // 15 minutes
//     stopOnTerminate: false,
//     startOnBoot: true,
//   });
// }

// const fetchPills = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM medicine_list WHERE user_id = ?",
//         [userID],
//         (txObj, resultSet) => {
//           resolve(resultSet.rows._array);
//         },
//         (txObj, error) => {
//           console.log(error);
//           reject(error);
//         }
//       );
//     });
//   });
// }

// import React, { useEffect } from 'react';
// import { Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';

// export default function App() {
//   useEffect(() => {
//     async function configureNotifications() {
//       if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//         });
//       }
//       const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//       if (status !== 'granted') {
//         await Permissions.askAsync(Permissions.NOTIFICATIONS);
//       }
//       registerBackgroundFetch();
//     }
//     configureNotifications();
//   }, []);
  
//   useEffect(() => {
//     async function configureNotifications() {
//       if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//         });
//       }
//       const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//       if (status !== 'granted') {
//         await Permissions.askAsync(Permissions.NOTIFICATIONS);
//       }
//       registerBackgroundFetch();
//     }
//     configureNotifications();
//   }, []);

//   return (
//     <View></View>
//     // Your app components
//   );
// }
