import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { notificationService } from '@/services/notificationService';
import { usePets } from '@/contexts/PetContext.supabase';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';
import type { Subscription } from 'expo-notifications';

export function useNotifications() {
  const router = useRouter();
  const { preferences } = useNotificationPreferences();
  const {
    careTasks,
    meals,
    dietAlerts,
    pets,
  } = usePets();

  const notificationListener = useRef<Subscription | undefined>(undefined);
  const responseListener = useRef<Subscription | undefined>(undefined);

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();

    // Check if app was opened from a notification
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response.notification.request.content.title);
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Schedule notifications for care tasks
  useEffect(() => {
    const scheduleCareTasks = async () => {
      // Skip if notifications disabled globally
      if (!preferences.enabled) return;

      // Cancel existing care notifications
      const scheduled = await notificationService.getScheduledNotifications();
      const careNotifications = scheduled.filter(n => 
        n.content.data?.type === 'care' || n.content.data?.type === 'care-overdue'
      );
      
      await Promise.all(
        careNotifications.map(n => notificationService.cancelNotification(n.identifier))
      );

      // Schedule new notifications for incomplete tasks
      const incompleteTasks = careTasks.filter(task => !task.completed);
      
      for (const task of incompleteTasks) {
        const pet = pets.find(p => p.id === task.petId);
        if (!pet) continue;

        const now = new Date();
        const dueDate = new Date(task.dueDate);

        if (dueDate > now && preferences.careReminders) {
          // Schedule upcoming notification (only if enabled)
          await notificationService.scheduleCareNotification(task, pet.name);
        } else if (dueDate <= now && preferences.careOverdue) {
          // Schedule overdue notification (only if enabled)
          await notificationService.scheduleOverdueNotification(task, pet.name);
        }
      }
    };

    scheduleCareTasks();
  }, [careTasks, pets, preferences.enabled, preferences.careReminders, preferences.careOverdue]);

  // Schedule notifications for meals
  useEffect(() => {
    const scheduleMeals = async () => {
      // Skip if notifications disabled globally
      if (!preferences.enabled) return;

      // Cancel existing meal notifications
      const scheduled = await notificationService.getScheduledNotifications();
      const mealNotifications = scheduled.filter(n => 
        n.content.data?.type === 'meal' || n.content.data?.type === 'meal-missed'
      );
      
      await Promise.all(
        mealNotifications.map(n => notificationService.cancelNotification(n.identifier))
      );

      // Schedule notifications for today's incomplete meals
      const today = new Date();
      const todaysMeals = meals.filter(meal => {
        const mealDate = new Date(meal.scheduledDate);
        return (
          !meal.completed &&
          mealDate.getDate() === today.getDate() &&
          mealDate.getMonth() === today.getMonth() &&
          mealDate.getFullYear() === today.getFullYear()
        );
      });

      for (const meal of todaysMeals) {
        const pet = pets.find(p => p.id === meal.petId);
        if (pet) {
          // Schedule reminder 15 minutes before (only if enabled)
          if (preferences.mealReminders) {
            await notificationService.scheduleMealNotification(meal, pet.name);
          }
          
          // Schedule missed meal check 30 minutes after (only if enabled)
          if (preferences.missedMeals) {
            await notificationService.scheduleMissedMealNotification(meal, pet.name);
          }
        }
      }
    };

    scheduleMeals();
  }, [meals, pets, preferences.enabled, preferences.mealReminders, preferences.missedMeals]);

  // Send notifications for new diet alerts
  useEffect(() => {
    const sendDietAlerts = async () => {
      // Skip if notifications disabled globally or diet alerts disabled
      if (!preferences.enabled || !preferences.dietAlerts) return;

      const activeAlerts = dietAlerts.filter(alert => !alert.dismissed);
      
      for (const alert of activeAlerts) {
        const pet = pets.find(p => p.id === alert.petId);
        if (pet) {
          // Check if we've already sent a notification for this alert
          // (You might want to track this in AsyncStorage to avoid duplicates)
          await notificationService.sendDietAlertNotification(
            pet.name,
            alert.type,
            alert.message,
            alert.severity
          );
        }
      }
    };

    sendDietAlerts();
  }, [dietAlerts, pets, preferences.enabled, preferences.dietAlerts]);

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types and navigate to relevant screens
    switch (data.type) {
      case 'care':
      case 'care-overdue':
        // For care notifications, navigate to pet detail to show care tasks
        if (data.petId) {
          router.push(`/pet/${data.petId}` as any);
        } else {
          // Fallback to care tab if no petId
          router.push('/(tabs)/care');
        }
        break;
      
      case 'meal':
      case 'meal-missed':
        // For meal notifications, navigate to pet detail to show diet info
        if (data.petId) {
          router.push(`/pet/${data.petId}` as any);
        } else {
          // Fallback to diet tab if no petId
          router.push('/(tabs)/diet');
        }
        break;
      
      case 'diet-alert':
        // For diet alerts, navigate to diet tab to show all alerts
        router.push('/(tabs)/diet');
        break;
      
      default:
        // Default to home screen
        router.push('/(tabs)/' as any);
        break;
    }
  };

  return {
    requestPermissions: () => notificationService.requestPermissions(),
    cancelAllNotifications: () => notificationService.cancelAllNotifications(),
    getScheduledNotifications: () => notificationService.getScheduledNotifications(),
  };
}
