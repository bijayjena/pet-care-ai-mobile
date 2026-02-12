import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';
import type { HealthStatus } from '@/types/pet';

interface HealthStatusCardProps {
  status: HealthStatus;
  message: string;
  action?: {
    text: string;
    label: string;
    hint: string;
    onPress: () => void;
  };
}

export function HealthStatusCard({ status, message, action }: HealthStatusCardProps) {
  const statusConfig = {
    healthy: { icon: '🟢', label: 'All Healthy', color: colors.status.healthy },
    caution: { icon: '🟡', label: 'Monitor Needed', color: colors.status.caution },
    urgent: { icon: '🔴', label: 'Needs Attention', color: colors.status.urgent },
  };

  const config = statusConfig[status];

  return (
    <View
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Health status: ${config.label}`}
      style={[styles.card, { borderLeftColor: config.color }]}
    >
      <Text style={styles.statusLabel}>
        {config.icon} {config.label}
      </Text>

      <Text style={styles.message}>{message}</Text>

      {action && (
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={action.label}
          accessibilityHint={action.hint}
          accessibilityRole="button"
          style={[styles.button, { backgroundColor: config.color }]}
          onPress={action.onPress}
        >
          <Text style={styles.buttonText}>{action.text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 6,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.md,
  },
  statusLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  message: {
    fontSize: typography.sizes.base,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  button: {
    height: touchTargets.large,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
});
