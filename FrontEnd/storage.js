import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

// Initialize SQLite Database
const db = SQLite.openDatabase('notifications.db');

// Fetch medication data from SQLite
const fetchPills = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM medicine_list WHERE user_id = ?",
        [userID],
        (txObj, resultSet) => resolve(resultSet.rows._array),
        (txObj, error) => reject(error)
      );
    });
  });
};

// Process and schedule notifications based on medication data
const scheduleNotificationsForMedication = async (medications) => {
  const now = new Date();
  
  for (const med of medications) {
    const startDate = new Date(med.startDate);
    const endDate = new Date(med.endDate);

    // Check if the current date is within the medication period
    if (now >= startDate && now <= endDate) {
      const daysOfWeek = [
        med.sunday, med.monday, med.tuesday, med.wednesday, 
        med.thursday, med.friday, med.saturday
      ];

      // Get today's day of the week (0-6 where 0 is Sunday)
      const today = now.getDay();

      if (daysOfWeek[today]) {
        // Schedule notifications for the relevant times
        const times = [
          { time: med.BeforeBreakfast, label: 'Before Breakfast' },
          { time: med.AfterBreakfast, label: 'After Breakfast' },
          { time: med.BeforeLunch, label: 'Before Lunch' },
          { time: med.AfterLunch, label: 'After Lunch' },
          { time: med.BeforeDinner, label: 'Before Dinner' },
          { time: med.AfterDinner, label: 'After Dinner' },
        ];

        for (const { time, label } of times) {
          if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            const notificationTime = new Date(now);
            notificationTime.setHours(hours, minutes, 0, 0);

            // Only schedule future notifications
            if (notificationTime > now) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `Time to take your medication: ${med.medicineName}`,
                  body: `${label} - ${med.medicineName}`,
                },
                trigger: { seconds: (notificationTime.getTime() - now.getTime()) / 1000 },
              });
            }
          }
        }
      }
    }
  }
};

// Set Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Fetch medication data and schedule notifications
    fetchPills().then(medications => scheduleNotificationsForMedication(medications));

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(channels.map(c => c.id), null, 2)}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a test notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
