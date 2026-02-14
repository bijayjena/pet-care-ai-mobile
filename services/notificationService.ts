import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { CareTask } from '@/types/care';
import type { Meal } from '@/types/diet';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationSchedule {
  id: string;
  type: 'care' | 'meal' | 'diet-alert';
  title: string;
  body: string;
  data: any;
  trigger: Date;
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.requestPermissions();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return false;
    }

    // Configure Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Pet Care Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });

      await Notifications.setNotificationChannelAsync('urgent', {
        name: 'Urgent Pet Care',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#EF4444',
      });
    }

    return true;
  }

  // Schedule notification for upcoming care task
  async scheduleCareNotification(task: CareTask, petName: string): Promise<string | null> {
    try {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      
      // Don't schedule if already past due
      if (dueDate <= now) return null;

      // Schedule notification 1 hour before due time
      const notificationTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
      
      // Don't schedule if notification time is in the past
      if (notificationTime <= now) return null;

      // Calculate seconds until notification
      const secondsUntilNotification = Math.floor((notificationTime.getTime() - now.getTime()) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${this.getCareIcon(task.category)} ${task.title}`,
          body: `Due in 1 hour for ${petName}`,
          data: {
            type: 'care',
            taskId: task.id,
            petId: task.petId,
            category: task.category,
          },
          sound: true,
          priority: task.priority === 'high' ? 'high' : 'default',
          categoryIdentifier: task.priority === 'high' ? 'urgent' : 'default',
        },
        trigger: { seconds: secondsUntilNotification },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling care notification:', error);
      return null;
    }
  }

  // Schedule notification for overdue care task
  async scheduleOverdueNotification(task: CareTask, petName: string): Promise<string | null> {
    try {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      
      // Only schedule if overdue
      if (dueDate > now) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⚠️ Overdue: ${task.title}`,
          body: `This care task is overdue for ${petName}`,
          data: {
            type: 'care-overdue',
            taskId: task.id,
            petId: task.petId,
            category: task.category,
          },
          sound: true,
          priority: 'high',
          categoryIdentifier: 'urgent',
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling overdue notification:', error);
      return null;
    }
  }

  // Schedule notification for meal reminder
  async scheduleMealNotification(meal: Meal, petName: string): Promise<string | null> {
    try {
      const now = new Date();
      const scheduledDate = new Date(meal.scheduledDate);
      
      // Parse time (format: "HH:MM")
      const [hours, minutes] = meal.time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Schedule notification 15 minutes before meal time
      const notificationTime = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
      
      // Don't schedule if notification time is in the past
      if (notificationTime <= now) return null;

      // Calculate seconds until notification
      const secondsUntilNotification = Math.floor((notificationTime.getTime() - now.getTime()) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🍽️ ${this.getMealTypeLabel(meal.mealType)} Time`,
          body: `${petName}'s ${meal.mealType} in 15 minutes - ${meal.food}`,
          data: {
            type: 'meal',
            mealId: meal.id,
            petId: meal.petId,
            mealType: meal.mealType,
          },
          sound: true,
          priority: 'default',
        },
        trigger: { seconds: secondsUntilNotification },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling meal notification:', error);
      return null;
    }
  }

  // Schedule notification for missed meal
  async scheduleMissedMealNotification(meal: Meal, petName: string): Promise<string | null> {
    try {
      const now = new Date();
      const scheduledDate = new Date(meal.scheduledDate);
      
      // Parse time
      const [hours, minutes] = meal.time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Schedule notification 30 minutes after meal time if not completed
      const notificationTime = new Date(scheduledDate.getTime() + 30 * 60 * 1000);
      
      // Don't schedule if notification time is in the past
      if (notificationTime <= now) return null;

      // Calculate seconds until notification
      const secondsUntilNotification = Math.floor((notificationTime.getTime() - now.getTime()) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Missed Meal Alert`,
          body: `Did ${petName} have their ${meal.mealType}?`,
          data: {
            type: 'meal-missed',
            mealId: meal.id,
            petId: meal.petId,
            mealType: meal.mealType,
          },
          sound: true,
          priority: 'high',
        },
        trigger: secondsUntilNotification as any,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling missed meal notification:', error);
      return null;
    }
  }

  // Send immediate notification for diet alert
  async sendDietAlertNotification(
    petName: string,
    alertType: string,
    message: string,
    severity: 'warning' | 'urgent'
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: severity === 'urgent' ? '🚨 Urgent Diet Alert' : '⚠️ Diet Alert',
          body: `${petName}: ${message}`,
          data: {
            type: 'diet-alert',
            alertType,
            severity,
          },
          sound: true,
          priority: severity === 'urgent' ? 'high' : 'default',
          categoryIdentifier: severity === 'urgent' ? 'urgent' : 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending diet alert notification:', error);
    }
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Cancel all notifications for a specific task/meal
  async cancelNotificationsByData(dataKey: string, dataValue: string): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduled
        .filter(n => n.content.data?.[dataKey] === dataValue)
        .map(n => n.identifier);
      
      await Promise.all(toCancel.map(id => this.cancelNotification(id)));
    } catch (error) {
      console.error('Error canceling notifications by data:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Helper methods
  private getCareIcon(category: string): string {
    const icons: Record<string, string> = {
      medication: '💊',
      vaccination: '💉',
      grooming: '✂️',
      hygiene: '🛁',
      appointment: '🏥',
      wellness: '❤️',
      deworming: '🐛',
    };
    return icons[category] || '📋';
  }

  private getMealTypeLabel(mealType: string): string {
    const labels: Record<string, string> = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
    };
    return labels[mealType] || mealType;
  }
}

export const notificationService = new NotificationService();
