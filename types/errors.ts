// Error types and interfaces

export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  STATE = 'STATE',
  STORAGE = 'STORAGE',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  details?: any;
  timestamp: Date;
  stack?: string;
  recoverable: boolean;
  retryable: boolean;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class NetworkError extends Error {
  type = ErrorType.NETWORK;
  severity = ErrorSeverity.MEDIUM;
  recoverable = true;
  retryable = true;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class APIError extends Error {
  type = ErrorType.API;
  severity = ErrorSeverity.MEDIUM;
  recoverable = true;
  retryable = false;

  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class StateError extends Error {
  type = ErrorType.STATE;
  severity = ErrorSeverity.HIGH;
  recoverable = false;
  retryable = false;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'StateError';
  }
}

export class StorageError extends Error {
  type = ErrorType.STORAGE;
  severity = ErrorSeverity.HIGH;
  recoverable = true;
  retryable = true;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ValidationError extends Error {
  type = ErrorType.VALIDATION;
  severity = ErrorSeverity.LOW;
  recoverable = true;
  retryable = false;

  constructor(message: string, public field?: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PermissionError extends Error {
  type = ErrorType.PERMISSION;
  severity = ErrorSeverity.MEDIUM;
  recoverable = true;
  retryable = false;

  constructor(message: string, public permission?: string) {
    super(message);
    this.name = 'PermissionError';
  }
}
