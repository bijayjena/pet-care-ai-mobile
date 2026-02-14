// Analytics event types and interfaces

export enum AnalyticsEvent {
  // App Lifecycle
  APP_OPENED = 'app_opened',
  APP_BACKGROUNDED = 'app_backgrounded',
  APP_CLOSED = 'app_closed',
  
  // Screen Views
  SCREEN_VIEW = 'screen_view',
  
  // Pet Management
  PET_ADDED = 'pet_added',
  PET_UPDATED = 'pet_updated',
  PET_DELETED = 'pet_deleted',
  PET_VIEWED = 'pet_viewed',
  
  // Care Actions
  VACCINE_COMPLETED = 'vaccine_completed',
  VACCINE_ADDED = 'vaccine_added',
  DEWORMING_COMPLETED = 'deworming_completed',
  DEWORMING_ADDED = 'deworming_added',
  CARE_TASK_COMPLETED = 'care_task_completed',
  CARE_TASK_ADDED = 'care_task_added',
  
  // Diet & Nutrition
  MEAL_FED = 'meal_fed',
  MEAL_SKIPPED = 'meal_skipped',
  MEAL_REFUSED = 'meal_refused',
  MEAL_ADDED = 'meal_added',
  DIET_ALERT_DISMISSED = 'diet_alert_dismissed',
  
  // AI Assistant
  AI_MESSAGE_SENT = 'ai_message_sent',
  AI_EMERGENCY_DETECTED = 'ai_emergency_detected',
  AI_PET_CHANGED = 'ai_pet_changed',
  AI_QUICK_PROMPT_USED = 'ai_quick_prompt_used',
  
  // Notifications
  NOTIFICATION_RECEIVED = 'notification_received',
  NOTIFICATION_OPENED = 'notification_opened',
  NOTIFICATION_SETTINGS_CHANGED = 'notification_settings_changed',
  NOTIFICATION_PERMISSION_REQUESTED = 'notification_permission_requested',
  NOTIFICATION_PERMISSION_GRANTED = 'notification_permission_granted',
  NOTIFICATION_PERMISSION_DENIED = 'notification_permission_denied',
  
  // Emergency
  EMERGENCY_MODAL_OPENED = 'emergency_modal_opened',
  EMERGENCY_VET_CALLED = 'emergency_vet_called',
  EMERGENCY_POISON_CONTROL_CALLED = 'emergency_poison_control_called',
  EMERGENCY_CLINIC_SEARCHED = 'emergency_clinic_searched',
  
  // User Actions
  REMINDER_COMPLETED = 'reminder_completed',
  REMINDER_ADDED = 'reminder_added',
  QUICK_ACTION_USED = 'quick_action_used',
  
  // Errors
  ERROR_OCCURRED = 'error_occurred',
  ERROR_RECOVERED = 'error_recovered',
  
  // Engagement
  FEATURE_DISCOVERED = 'feature_discovered',
  TUTORIAL_STARTED = 'tutorial_started',
  TUTORIAL_COMPLETED = 'tutorial_completed',
  FEEDBACK_SUBMITTED = 'feedback_submitted',
}

export interface AnalyticsEventProperties {
  // Common properties
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
  
  // Screen properties
  screenName?: string;
  previousScreen?: string;
  
  // Pet properties
  petId?: string;
  petType?: 'dog' | 'cat';
  petAge?: number;
  petBreed?: string;
  
  // Action properties
  actionType?: string;
  actionResult?: 'success' | 'failure' | 'cancelled';
  
  // Care properties
  careType?: 'vaccine' | 'deworming' | 'task';
  careStatus?: string;
  
  // Meal properties
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealStatus?: 'fed' | 'skipped' | 'refused';
  portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none';
  
  // AI properties
  messageLength?: number;
  isEmergency?: boolean;
  quickPrompt?: string;
  
  // Notification properties
  notificationType?: string;
  notificationCategory?: string;
  permissionStatus?: 'granted' | 'denied' | 'undetermined';
  
  // Error properties
  errorType?: string;
  errorMessage?: string;
  errorSeverity?: string;
  
  // Additional metadata
  [key: string]: any;
}

export interface AnalyticsUserProperties {
  userId?: string;
  email?: string;
  createdAt?: Date;
  lastActiveAt?: Date;
  
  // Pet ownership
  totalPets?: number;
  dogCount?: number;
  catCount?: number;
  
  // Usage stats
  totalSessions?: number;
  totalScreenViews?: number;
  totalActions?: number;
  
  // Feature usage
  usesAIAssistant?: boolean;
  usesNotifications?: boolean;
  usesCareTracking?: boolean;
  usesDietTracking?: boolean;
  
  // Preferences
  notificationsEnabled?: boolean;
  preferredLanguage?: string;
  
  // Additional properties
  [key: string]: any;
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  anonymizeData: boolean;
  trackScreenViews: boolean;
  trackErrors: boolean;
  batchEvents: boolean;
  batchSize: number;
  flushInterval: number; // milliseconds
}

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: true,
  debug: __DEV__,
  anonymizeData: false,
  trackScreenViews: true,
  trackErrors: true,
  batchEvents: true,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
};

// Declare __DEV__ for TypeScript
declare const __DEV__: boolean;
