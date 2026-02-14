import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnalyticsEvent,
  AnalyticsEventProperties,
  AnalyticsUserProperties,
  AnalyticsConfig,
  DEFAULT_ANALYTICS_CONFIG,
} from '@/types/analytics';
import { errorHandler } from './errorHandler';

const STORAGE_KEYS = {
  USER_ID: '@analytics_user_id',
  SESSION_ID: '@analytics_session_id',
  EVENT_QUEUE: '@analytics_event_queue',
  USER_PROPERTIES: '@analytics_user_properties',
};

interface QueuedEvent {
  event: AnalyticsEvent;
  properties: AnalyticsEventProperties;
  timestamp: Date;
}

class AnalyticsService {
  private config: AnalyticsConfig = DEFAULT_ANALYTICS_CONFIG;
  private userId: string | null = null;
  private sessionId: string | null = null;
  private eventQueue: QueuedEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private userProperties: AnalyticsUserProperties = {};
  private currentScreen: string | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize analytics service
   */
  private async initialize() {
    try {
      // Load user ID
      const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      if (storedUserId) {
        this.userId = storedUserId;
      } else {
        this.userId = this.generateUserId();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, this.userId);
      }

      // Generate new session ID
      this.sessionId = this.generateSessionId();
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, this.sessionId);

      // Load user properties
      const storedProperties = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROPERTIES);
      if (storedProperties) {
        this.userProperties = JSON.parse(storedProperties);
      }

      // Load queued events
      const storedQueue = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_QUEUE);
      if (storedQueue) {
        this.eventQueue = JSON.parse(storedQueue);
      }

      // Start flush timer
      this.startFlushTimer();

      if (this.config.debug) {
        console.log('[Analytics] Initialized', {
          userId: this.userId,
          sessionId: this.sessionId,
        });
      }
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'AnalyticsService',
        action: 'initialize',
      });
    }
  }

  /**
   * Configure analytics service
   */
  configure(config: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...config };
    
    if (this.config.debug) {
      console.log('[Analytics] Configured', this.config);
    }
  }

  /**
   * Track an event
   */
  async track(event: AnalyticsEvent, properties: AnalyticsEventProperties = {}) {
    if (!this.config.enabled) return;

    try {
      const enrichedProperties: AnalyticsEventProperties = {
        ...properties,
        timestamp: new Date(),
        userId: this.config.anonymizeData ? this.anonymizeUserId(this.userId) : this.userId,
        sessionId: this.sessionId,
      };

      // Add to queue
      this.eventQueue.push({
        event,
        properties: enrichedProperties,
        timestamp: new Date(),
      });

      if (this.config.debug) {
        console.log('[Analytics] Event tracked', event, enrichedProperties);
      }

      // Flush if batch size reached
      if (this.eventQueue.length >= this.config.batchSize) {
        await this.flush();
      }

      // Save queue to storage
      await this.saveQueue();
    } catch (error) {
      errorHandler.handle(error, {
        component: 'AnalyticsService',
        action: 'track',
        metadata: { event },
      });
    }
  }

  /**
   * Track screen view
   */
  async trackScreenView(screenName: string, properties: AnalyticsEventProperties = {}) {
    if (!this.config.trackScreenViews) return;

    await this.track(AnalyticsEvent.SCREEN_VIEW, {
      ...properties,
      screenName,
      previousScreen: this.currentScreen,
    });

    this.currentScreen = screenName;
  }

  /**
   * Set user properties
   */
  async setUserProperties(properties: AnalyticsUserProperties) {
    try {
      this.userProperties = {
        ...this.userProperties,
        ...properties,
        lastActiveAt: new Date(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROPERTIES,
        JSON.stringify(this.userProperties)
      );

      if (this.config.debug) {
        console.log('[Analytics] User properties set', this.userProperties);
      }
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'AnalyticsService',
        action: 'setUserProperties',
      });
    }
  }

  /**
   * Increment user property
   */
  async incrementUserProperty(property: string, value: number = 1) {
    const currentValue = (this.userProperties[property] as number) || 0;
    await this.setUserProperties({
      [property]: currentValue + value,
    });
  }

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Get user properties
   */
  getUserProperties(): AnalyticsUserProperties {
    return { ...this.userProperties };
  }

  /**
   * Flush event queue
   */
  private async flush() {
    if (this.eventQueue.length === 0) return;

    try {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      // In a real app, send to analytics service (e.g., Mixpanel, Amplitude, Firebase)
      // For now, just log in debug mode
      if (this.config.debug) {
        console.log('[Analytics] Flushing events', eventsToSend.length);
        eventsToSend.forEach(({ event, properties }) => {
          console.log(`  - ${event}`, properties);
        });
      }

      // Here you would send to your analytics backend:
      // await fetch('https://your-analytics-api.com/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventsToSend),
      // });

      // Clear stored queue
      await AsyncStorage.removeItem(STORAGE_KEYS.EVENT_QUEUE);
    } catch (error) {
      // Re-add events to queue on failure
      this.eventQueue = [...this.eventQueue];
      
      errorHandler.handle(error, {
        component: 'AnalyticsService',
        action: 'flush',
      });
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EVENT_QUEUE,
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'AnalyticsService',
        action: 'saveQueue',
      });
    }
  }

  /**
   * Start flush timer
   */
  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Stop flush timer
   */
  private stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Generate user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Anonymize user ID
   */
  private anonymizeUserId(userId: string | null): string {
    if (!userId) return 'anonymous';
    
    // Simple hash for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `anon_${Math.abs(hash)}`;
  }

  /**
   * Reset analytics (for testing or user logout)
   */
  async reset() {
    try {
      // Flush remaining events
      await this.flush();

      // Clear storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.SESSION_ID,
        STORAGE_KEYS.EVENT_QUEUE,
        STORAGE_KEYS.USER_PROPERTIES,
      ]);

      // Reset state
      this.userId = null;
      this.sessionId = null;
      this.eventQueue = [];
      this.userProperties = {};
      this.currentScreen = null;

      // Reinitialize
      await this.initialize();

      if (this.config.debug) {
        console.log('[Analytics] Reset complete');
      }
    } catch (error) {
      errorHandler.handle(error, {
        component: 'AnalyticsService',
        action: 'reset',
      });
    }
  }

  /**
   * Get event queue size
   */
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
    
    if (this.config.debug) {
      console.log('[Analytics] Enabled:', enabled);
    }
  }

  /**
   * Cleanup on app close
   */
  async cleanup() {
    this.stopFlushTimer();
    await this.flush();
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Convenience functions for common events
export const trackScreenView = (screenName: string, properties?: AnalyticsEventProperties) =>
  analytics.trackScreenView(screenName, properties);

export const trackPetAdded = (petType: 'dog' | 'cat', breed?: string) =>
  analytics.track(AnalyticsEvent.PET_ADDED, { petType, petBreed: breed });

export const trackMealCompleted = (
  mealType: string,
  status: 'fed' | 'skipped' | 'refused',
  portionAdjustment?: string
) =>
  analytics.track(AnalyticsEvent[`MEAL_${status.toUpperCase()}` as keyof typeof AnalyticsEvent], {
    mealType,
    mealStatus: status,
    portionAdjustment,
  });

export const trackAIMessage = (messageLength: number, isEmergency: boolean) =>
  analytics.track(AnalyticsEvent.AI_MESSAGE_SENT, {
    messageLength,
    isEmergency,
  });

export const trackEmergency = (actionType: string) =>
  analytics.track(
    AnalyticsEvent[`EMERGENCY_${actionType.toUpperCase()}` as keyof typeof AnalyticsEvent] || AnalyticsEvent.EMERGENCY_MODAL_OPENED,
    { actionType }
  );

export const trackError = (errorType: string, errorMessage: string, errorSeverity: string) =>
  analytics.track(AnalyticsEvent.ERROR_OCCURRED, {
    errorType,
    errorMessage,
    errorSeverity,
  });
