import { useRef, useEffect, useCallback } from 'react';

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to ensure a function is called at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle a callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useRef<T | undefined>(undefined);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    throttledCallback.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        throttledCallback.current?.(...args);
        lastRan.current = now;
      }
    }) as T,
    [delay]
  );
}

/**
 * Hook to track component render count (dev only)
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    if (__DEV__) {
      console.log(`[${componentName}] Render count: ${renderCount.current}`);
    }
  });

  return renderCount.current;
}

/**
 * Hook to measure component render time (dev only)
 */
export function useRenderTime(componentName: string) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    if (__DEV__ && renderTime > 16) { // Warn if render takes longer than 1 frame (16ms)
      console.warn(`[${componentName}] Slow render: ${renderTime}ms`);
    }
    
    startTime.current = Date.now();
  });
}

/**
 * Batch multiple state updates to reduce re-renders
 */
export function batchUpdates(callback: () => void) {
  // React 18+ automatically batches updates
  // This is a no-op but kept for compatibility
  callback();
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Check if two objects are shallowly equal
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

/**
 * Hook for previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Hook to detect if component is mounted
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

/**
 * Lazy load a component
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// Add missing import
import { useState } from 'react';
import React from 'react';

// Declare __DEV__ for TypeScript
declare const __DEV__: boolean;
