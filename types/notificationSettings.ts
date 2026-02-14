// Notification settings types

export interface NotificationPreferences {
  // Global toggle
  enabled: boolean;
  
  // Category toggles
  careReminders: boolean;
  careOverdue: boolean;
  mealReminders: boolean;
  missedMeals: boolean;
  dietAlerts: boolean;
  
  // Timing preferences (optional for future)
  careReminderMinutes?: number; // Default: 60
  mealReminderMinutes?: number; // Default: 15
  missedMealMinutes?: number;   // Default: 30
  
  // Quiet hours (optional for future)
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;     // Format: "HH:MM"
  quietHoursEnd?: string;       // Format: "HH:MM"
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  careReminders: true,
  careOverdue: true,
  mealReminders: true,
  missedMeals: true,
  dietAlerts: true,
  careReminderMinutes: 60,
  mealReminderMinutes: 15,
  missedMealMinutes: 30,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};
