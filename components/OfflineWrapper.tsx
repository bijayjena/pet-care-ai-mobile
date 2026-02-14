import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflinePlaceholder } from './OfflinePlaceholder';

interface OfflineWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiresInternet?: boolean;
  onRetry?: () => void;
  offlineMessage?: string;
}

export function OfflineWrapper({
  children,
  fallback,
  requiresInternet = false,
  onRetry,
  offlineMessage,
}: OfflineWrapperProps) {
  const { isOffline } = useNetworkStatus();

  // If feature doesn't require internet, always show children
  if (!requiresInternet) {
    return <>{children}</>;
  }

  // If offline and requires internet, show fallback or placeholder
  if (isOffline) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.container}>
        <OfflinePlaceholder
          message={offlineMessage}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </View>
    );
  }

  // Online, show children
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
