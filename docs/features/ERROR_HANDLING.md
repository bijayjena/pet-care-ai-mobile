# Error Handling

Global error handling system for Pet Care AI.

## Overview

- Global error handler with logging
- Error boundary for React errors
- User-friendly error messages
- Error tracking and statistics
- Automatic retry functionality

## Files

- `services/errorHandler.ts` - Error handler service
- `types/errors.ts` - Error types and classes
- `components/ErrorBoundary.tsx` - React error boundary

## Usage

```typescript
import { ErrorHandler } from '@/services/errorHandler';

try {
  await riskyOperation();
} catch (error) {
  await ErrorHandler.handle(error, {
    context: 'MyComponent',
    showAlert: true,
    logToService: true
  });
}
```

## Error Types

- `NetworkError` - Network failures
- `APIError` - API failures
- `StateError` - State management errors
- `StorageError` - AsyncStorage errors
- `ValidationError` - Data validation errors
- `PermissionError` - Permission denied errors

## Features

- Error normalization
- User-friendly alerts
- Error logging (last 50 errors)
- Retry functionality
- Error statistics
- Error listeners

See `services/errorHandler.ts` for complete API.
