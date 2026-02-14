import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationPreferences } from '@/types/notificationSettings';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '@/types/notificationSettings';
import { errorHandler } from '@/services/errorHandler';

interface NotificationPreferencesContextType {
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  isLoading: boolean;
}

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = '@notification_preferences';

export function NotificationPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_NOTIFICATION_PREFERENCES, ...parsed });
      }
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'NotificationPreferencesContext',
        action: 'loadPreferences',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'NotificationPreferencesContext',
        action: 'updatePreferences',
      });
      throw error;
    }
  };

  const resetPreferences = async () => {
    try {
      setPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATION_PREFERENCES));
    } catch (error) {
      errorHandler.handleStorageError(error, {
        component: 'NotificationPreferencesContext',
        action: 'resetPreferences',
      });
      throw error;
    }
  };

  return (
    <NotificationPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        isLoading,
      }}
    >
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (context === undefined) {
    throw new Error('useNotificationPreferences must be used within a NotificationPreferencesProvider');
  }
  return context;
}
