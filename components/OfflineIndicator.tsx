import { View, Text, StyleSheet } from 'react-native';
import { WifiOff, Zap } from 'lucide-react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { colors, spacing } from '@/constants/theme';

interface OfflineIndicatorProps {
  feature?: string;
  compact?: boolean;
}

export function OfflineIndicator({ feature = 'AI', compact = false }: OfflineIndicatorProps) {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <WifiOff size={14} color={colors.status.caution} />
        <Text style={styles.compactText}>Offline Mode</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <WifiOff size={16} color={colors.status.caution} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Offline Mode</Text>
        <Text style={styles.message}>
          {feature} features are limited. Using cached responses.
        </Text>
      </View>
      <View style={styles.badge}>
        <Zap size={12} color={colors.status.caution} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.status.caution,
  },
});
