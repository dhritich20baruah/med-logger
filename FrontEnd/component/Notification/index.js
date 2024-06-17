import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { fetchPills } from './db';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

export async function scheduleNotification(time, message, id) {
  const trigger = new Date(time);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Medicine Reminder',
      body: message,
    },
    trigger,
    identifier: id,
  });
}

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  const medicines = await fetchPills(); // You need to modify this function to return a promise
  const now = new Date();

  medicines.forEach((medicine) => {
    const { startDate, endDate, AfterBreakfast, AfterLunch, AfterDinner, BeforeBreakfast, BeforeLunch, BeforeDinner } = medicine;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now >= start && now <= end) {
      if (AfterBreakfast) {
        const afterBreakfastTime = new Date();
        afterBreakfastTime.setHours(...AfterBreakfast.split(':').map(Number));
        if (afterBreakfastTime > now) {
          scheduleNotification(afterBreakfastTime, `Time to take your ${medicine.medicineName} after breakfast`, `${medicine.id}-AfterBreakfast`);
        }
      }
      if (BeforeBreakfast) {
        const beforeBreakfastTime = new Date();
        beforeBreakfastTime.setHours(...BeforeBreakfast.split(':').map(Number));
        if (beforeBreakfastTime > now) {
          scheduleNotification(beforeBreakfastTime, `Time to take your ${medicine.medicineName} before breakfast`, `${medicine.id}-BeforeBreakfast`);
        }
      }
      if (AfterLunch) {
        const afterLunchTime = new Date();
        afterLunchTime.setHours(...AfterLunch.split(':').map(Number));
        if (afterLunchTime > now) {
          scheduleNotification(afterLunchTime, `Time to take your ${medicine.medicineName} after lunch`, `${medicine.id}-AfterLunch`);
        }
      }
      if (BeforeLunch) {
        const beforeLunchTime = new Date();
        beforeLunchTime.setHours(...BeforeLunch.split(':').map(Number));
        if (beforeLunchTime > now) {
          scheduleNotification(beforeLunchTime, `Time to take your ${medicine.medicineName} before lunch`, `${medicine.id}-BeforeLunch`);
        }
      }
      // Repeat for other times like AfterLunch, AfterDinner, BeforeBreakfast, BeforeLunch, BeforeDinner
      if (AfterDinner) {
        const afterDinnerTime = new Date();
        afterDinnerTime.setHours(...AfterDinner.split(':').map(Number));
        if (afterDinnerTime > now) {
          scheduleNotification(afterDinnerTime, `Time to take your ${medicine.medicineName} after dinner`, `${medicine.id}-AfterDinner`);
        }
      }
      if (BeforeDinner) {
        const beforeDinnerTime = new Date();
        beforeDinnerTime.setHours(...BeforeDinner.split(':').map(Number));
        if (beforeDinnerTime > now) {
          scheduleNotification(beforeDinnerTime, `Time to take your ${medicine.medicineName} before lunch`, `${medicine.id}-BeforeDinner`);
        }
      }
    }
  });
});

export async function registerBackgroundFetch() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
