import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppError,
  ErrorType,
  ErrorSeverity,
  ErrorContext,
  NetworkError,
  APIError,
  StateError,
  StorageError,
  ValidationError,
  PermissionError,
} from '@/types/errors';

const ERROR_LOG_KEY = '@error_log';
const MAX_ERROR_LOG_SIZE = 100;

class ErrorHandler {
  private errorLog: AppError[] = [];
  private errorListeners: ((error: AppError) => void)[] = [];

  constructor() {
    this.loadErrorLog();
  }

  /**
   * Handle any error and convert to AppError
   */
  handle(error: any, context?: ErrorContext): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log error
    this.logError(appError);
    
    // Notify listeners
    this.notifyListeners(appError);
    
    // Track error in analytics
    this.trackError(appError);
    
    // Show user-facing message if appropriate
    if (appError.severity !== ErrorSeverity.LOW) {
      this.showUserMessage(appError);
    }
    
    // Log to console in dev
    if (__DEV__) {
      console.error('[ErrorHandler]', appError);
    }
    
    return appError;
  }

  /**
   * Track error in analytics
   */
  private trackError(error: AppError) {
    try {
      // Lazy import to avoid circular dependency
      import('@/services/analyticsService').then(({ analytics }) => {
        analytics.track('error_occurred' as any, {
          errorType: error.type,
          errorMessage: error.message,
          errorSeverity: error.severity,
          recoverable: error.recoverable,
          retryable: error.retryable,
        });
      });
    } catch (err) {
      // Silently fail - don't want analytics to break error handling
      if (__DEV__) {
        console.warn('[ErrorHandler] Failed to track error in analytics:', err);
      }
    }
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error: any, context?: ErrorContext): AppError {
    const networkError = new NetworkError(
      error.message || 'Network request failed',
      error
    );
    return this.handle(networkError, context);
  }

  /**
   * Handle API errors
   */
  handleAPIError(
    error: any,
    statusCode?: number,
    context?: ErrorContext
  ): AppError {
    const apiError = new APIError(
      error.message || 'API request failed',
      statusCode,
      error
    );
    return this.handle(apiError, context);
  }

  /**
   * Handle state errors
   */
  handleStateError(error: any, context?: ErrorContext): AppError {
    const stateError = new StateError(
      error.message || 'State management error',
      error
    );
    return this.handle(stateError, context);
  }

  /**
   * Handle storage errors
   */
  handleStorageError(error: any, context?: ErrorContext): AppError {
    const storageError = new StorageError(
      error.message || 'Storage operation failed',
      error
    );
    return this.handle(storageError, context);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(
    message: string,
    field?: string,
    context?: ErrorContext
  ): AppError {
    const validationError = new ValidationError(message, field);
    return this.handle(validationError, context);
  }

  /**
   * Handle permission errors
   */
  handlePermissionError(
    message: string,
    permission?: string,
    context?: ErrorContext
  ): AppError {
    const permissionError = new PermissionError(message, permission);
    return this.handle(permissionError, context);
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: any, context?: ErrorContext): AppError {
    const timestamp = new Date();
    const id = `error_${timestamp.getTime()}`;

    // If already an AppError-like object
    if (error.type && error.severity) {
      return {
        id,
        type: error.type,
        severity: error.severity,
        message: error.message,
        userMessage: this.getUserMessage(error),
        details: error.details || error,
        timestamp,
        stack: error.stack,
        recoverable: error.recoverable ?? true,
        retryable: error.retryable ?? false,
      };
    }

    // Network errors
    if (
      error instanceof NetworkError ||
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR'
    ) {
      return {
        id,
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        message: error.message || 'Network error occurred',
        userMessage: 'Unable to connect. Please check your internet connection.',
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: true,
        retryable: true,
      };
    }

    // API errors
    if (error instanceof APIError || error.statusCode) {
      return {
        id,
        type: ErrorType.API,
        severity: this.getAPISeverity(error.statusCode),
        message: error.message || 'API error occurred',
        userMessage: this.getAPIUserMessage(error.statusCode),
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: true,
        retryable: error.statusCode >= 500,
      };
    }

    // Storage errors
    if (
      error instanceof StorageError ||
      error.message?.includes('AsyncStorage') ||
      error.message?.includes('storage')
    ) {
      return {
        id,
        type: ErrorType.STORAGE,
        severity: ErrorSeverity.HIGH,
        message: error.message || 'Storage error occurred',
        userMessage: 'Unable to save data. Please try again.',
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: true,
        retryable: true,
      };
    }

    // State errors
    if (error instanceof StateError) {
      return {
        id,
        type: ErrorType.STATE,
        severity: ErrorSeverity.HIGH,
        message: error.message || 'State error occurred',
        userMessage: 'Something went wrong. Please restart the app.',
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: false,
        retryable: false,
      };
    }

    // Validation errors
    if (error instanceof ValidationError) {
      return {
        id,
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        message: error.message,
        userMessage: error.message,
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: true,
        retryable: false,
      };
    }

    // Permission errors
    if (error instanceof PermissionError) {
      return {
        id,
        type: ErrorType.PERMISSION,
        severity: ErrorSeverity.MEDIUM,
        message: error.message,
        userMessage: error.message,
        details: error,
        timestamp,
        stack: error.stack,
        recoverable: true,
        retryable: false,
      };
    }

    // Unknown errors
    return {
      id,
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      message: error.message || 'An unexpected error occurred',
      userMessage: 'Something went wrong. Please try again.',
      details: error,
      timestamp,
      stack: error.stack,
      recoverable: true,
      retryable: false,
    };
  }

  /**
   * Get user-friendly message
   */
  private getUserMessage(error: any): string {
    if (error.userMessage) return error.userMessage;

    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Unable to connect. Please check your internet connection.';
      case ErrorType.API:
        return 'Unable to complete request. Please try again.';
      case ErrorType.STATE:
        return 'Something went wrong. Please restart the app.';
      case ErrorType.STORAGE:
        return 'Unable to save data. Please try again.';
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.PERMISSION:
        return error.message;
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  /**
   * Get API error severity based on status code
   */
  private getAPISeverity(statusCode?: number): ErrorSeverity {
    if (!statusCode) return ErrorSeverity.MEDIUM;
    if (statusCode >= 500) return ErrorSeverity.HIGH;
    if (statusCode >= 400) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  /**
   * Get API error user message based on status code
   */
  private getAPIUserMessage(statusCode?: number): string {
    if (!statusCode) return 'Unable to complete request. Please try again.';
    
    if (statusCode === 400) return 'Invalid request. Please check your input.';
    if (statusCode === 401) return 'Authentication required. Please sign in.';
    if (statusCode === 403) return 'Access denied. You don\'t have permission.';
    if (statusCode === 404) return 'Resource not found.';
    if (statusCode === 429) return 'Too many requests. Please wait and try again.';
    if (statusCode >= 500) return 'Server error. Please try again later.';
    
    return 'Unable to complete request. Please try again.';
  }

  /**
   * Show user-facing error message
   */
  private showUserMessage(error: AppError) {
    const title = this.getErrorTitle(error);
    const buttons: any[] = [{ text: 'OK', style: 'cancel' }];

    // Add retry button if retryable
    if (error.retryable) {
      buttons.unshift({
        text: 'Retry',
        onPress: () => {
          // Emit retry event
          this.notifyListeners({ ...error, message: 'RETRY_REQUESTED' } as any);
        },
      });
    }

    Alert.alert(title, error.userMessage, buttons);
  }

  /**
   * Get error title for alert
   */
  private getErrorTitle(error: AppError): string {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      case ErrorSeverity.HIGH:
        return 'Error';
      case ErrorSeverity.MEDIUM:
        return 'Oops!';
      case ErrorSeverity.LOW:
        return 'Notice';
      default:
        return 'Error';
    }
  }

  /**
   * Log error to memory and storage
   */
  private logError(error: AppError) {
    // Add to memory log
    this.errorLog.unshift(error);
    
    // Keep log size manageable
    if (this.errorLog.length > MAX_ERROR_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(0, MAX_ERROR_LOG_SIZE);
    }

    // Save to storage (debounced)
    this.saveErrorLog();
  }

  /**
   * Save error log to AsyncStorage
   */
  private async saveErrorLog() {
    try {
      const serialized = JSON.stringify(this.errorLog.slice(0, 50)); // Save last 50
      await AsyncStorage.setItem(ERROR_LOG_KEY, serialized);
    } catch (error) {
      console.error('Failed to save error log:', error);
    }
  }

  /**
   * Load error log from AsyncStorage
   */
  private async loadErrorLog() {
    try {
      const serialized = await AsyncStorage.getItem(ERROR_LOG_KEY);
      if (serialized) {
        this.errorLog = JSON.parse(serialized);
      }
    } catch (error) {
      console.error('Failed to load error log:', error);
    }
  }

  /**
   * Get error log
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  async clearErrorLog() {
    this.errorLog = [];
    try {
      await AsyncStorage.removeItem(ERROR_LOG_KEY);
    } catch (error) {
      console.error('Failed to clear error log:', error);
    }
  }

  /**
   * Add error listener
   */
  addListener(listener: (error: AppError) => void) {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: AppError) {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error: AppError): boolean {
    return error.recoverable;
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: AppError): boolean {
    return error.retryable;
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    const total = this.errorLog.length;
    const byType = this.errorLog.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = this.errorLog.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byType, bySeverity };
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();

// Declare __DEV__ for TypeScript
declare const __DEV__: boolean;
