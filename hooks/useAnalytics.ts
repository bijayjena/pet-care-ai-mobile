import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '@/services/analyticsService';
import { AnalyticsEvent, AnalyticsEventProperties } from '@/types/analytics';

/**
 * Hook to track screen views automatically
 */
export function useScreenTracking(screenName: string, properties?: AnalyticsEventProperties) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      analytics.trackScreenView(screenName, properties);
      hasTracked.current = true;
    }
  }, [screenName, properties]);
}

/**
 * Hook to track app lifecycle events
 */
export function useAppLifecycleTracking() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Track app opened
    analytics.track(AnalyticsEvent.APP_OPENED);

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        analytics.track(AnalyticsEvent.APP_OPENED);
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App went to background
        analytics.track(AnalyticsEvent.APP_BACKGROUNDED);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      analytics.track(AnalyticsEvent.APP_CLOSED);
      analytics.cleanup();
    };
  }, []);
}

/**
 * Hook to get analytics tracking functions
 */
export function useAnalytics() {
  const track = (event: AnalyticsEvent, properties?: AnalyticsEventProperties) => {
    analytics.track(event, properties);
  };

  const trackScreenView = (screenName: string, properties?: AnalyticsEventProperties) => {
    analytics.trackScreenView(screenName, properties);
  };

  const setUserProperties = (properties: Record<string, any>) => {
    analytics.setUserProperties(properties);
  };

  const incrementProperty = (property: string, value?: number) => {
    analytics.incrementUserProperty(property, value);
  };

  return {
    track,
    trackScreenView,
    setUserProperties,
    incrementProperty,
    getUserId: () => analytics.getUserId(),
    getSessionId: () => analytics.getSessionId(),
  };
}

/**
 * Hook to track errors automatically
 */
export function useErrorTracking() {
  useEffect(() => {
    const unsubscribe = errorHandler.addListener((error) => {
      analytics.track(AnalyticsEvent.ERROR_OCCURRED, {
        errorType: error.type,
        errorMessage: error.message,
        errorSeverity: error.severity,
      });
    });

    return unsubscribe;
  }, []);
}

// Import errorHandler for error tracking
import { errorHandler } from '@/services/errorHandler';
