import { useState, useEffect } from 'react';

interface UseLoadingStateOptions {
  initialDelay?: number;
  minimumDuration?: number;
}

/**
 * Hook to manage loading states with optional delays
 * Useful for showing skeleton loaders with smooth transitions
 */
export function useLoadingState(
  isDataReady: boolean,
  options: UseLoadingStateOptions = {}
) {
  const { initialDelay = 0, minimumDuration = 500 } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Start timer when component mounts
    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Handle initial delay
    if (initialDelay > 0 && !isDataReady) {
      const timer = setTimeout(() => {
        setIsLoading(true);
      }, initialDelay);
      return () => clearTimeout(timer);
    }

    // When data is ready, check if minimum duration has passed
    if (isDataReady && startTime !== null) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDuration - elapsed);

      if (remaining > 0) {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setIsLoading(false);
      }
    }
  }, [isDataReady, initialDelay, minimumDuration, startTime]);

  return isLoading;
}

/**
 * Simple loading state hook without delays
 */
export function useSimpleLoading(isDataReady: boolean) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDataReady) {
      // Small delay to prevent flash
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isDataReady]);

  return isLoading;
}
