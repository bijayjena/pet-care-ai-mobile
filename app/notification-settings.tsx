import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  BellOff, 
  Heart, 
  UtensilsCrossed, 
  AlertTriangle,
  Clock,
  Info,
  RotateCcw
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';
import { notificationService } from '@/services/notificationService';
import { colors, spacing } from '@/constants/theme';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { preferences, updatePreferences, resetPreferences } = useNotificationPreferences();
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    checkPermissionStatus();
    loadScheduledCount();
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const loadScheduledCount = async () => {
    const scheduled = await notificationService.getScheduledNotifications();
    setScheduledCount(scheduled.length);
  };

  const handleRequestPermissions = async () => {
    const granted = await notificationService.requestPermissions();
    if (granted) {
      Alert.alert('Success', 'Notification permissions granted!');
      checkPermissionStatus();
    } else {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive reminders.'
      );
    }
  };

  const handleToggleGlobal = async (value: boolean) => {
    await updatePreferences({ enabled: value });
    if (!value) {
      Alert.alert(
        'Notifications Disabled',
        'All notifications have been disabled. You can re-enable them anytime.'
      );
    }
  };

  const handleToggleCategory = async (category: keyof typeof preferences, value: boolean) => {
    await updatePreferences({ [category]: value });
  };

  const handleViewScheduled = async () => {
    const scheduled = await notificationService.getScheduledNotifications();
    
    if (scheduled.length === 0) {
      Alert.alert('No Scheduled Notifications', 'You have no upcoming notifications scheduled.');
      return;
    }

    const message = scheduled
      .slice(0, 10)
      .map((n, i) => {
        const trigger = n.trigger as any;
        const date = trigger?.date ? new Date(trigger.date) : null;
        return `${i + 1}. ${n.content.title}\n   ${date ? date.toLocaleString() : 'Immediate'}`;
      })
      .join('\n\n');

    Alert.alert(
      `Scheduled Notifications (${scheduled.length})`,
      message,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to cancel all scheduled notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await notificationService.cancelAllNotifications();
            setScheduledCount(0);
            Alert.alert('Success', 'All notifications cleared');
          },
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all notification settings to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetPreferences();
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return colors.status.healthy;
      case 'denied':
        return colors.status.urgent;
      default:
        return colors.status.caution;
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Enabled';
      case 'denied':
        return 'Denied';
      default:
        return 'Not Set';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          accessibilityLabel="Reset to defaults"
          accessibilityRole="button"
        >
          <RotateCcw size={20} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Permission Status Card */}
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>System Permissions:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getPermissionStatusColor() }]}>
                <Text style={styles.statusText}>{getPermissionStatusText()}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Scheduled Notifications:</Text>
              <Text style={styles.statusValue}>{scheduledCount}</Text>
            </View>
          </View>

          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleRequestPermissions}>
              <Bell size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Enable System Permissions</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Global Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Master Control</Text>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>All Notifications</Text>
                <Text style={styles.settingDescription}>
                  Enable or disable all notifications at once
                </Text>
              </View>
              <Switch
                value={preferences.enabled}
                onValueChange={handleToggleGlobal}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Care Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Care Reminders</Text>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Upcoming Care Tasks</Text>
                <Text style={styles.settingDescription}>
                  Remind me 1 hour before care tasks are due
                </Text>
              </View>
              <Switch
                value={preferences.enabled && preferences.careReminders}
                onValueChange={(value) => handleToggleCategory('careReminders', value)}
                disabled={!preferences.enabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Overdue Care Tasks</Text>
                <Text style={styles.settingDescription}>
                  Alert me immediately when care tasks are overdue
                </Text>
              </View>
              <Switch
                value={preferences.enabled && preferences.careOverdue}
                onValueChange={(value) => handleToggleCategory('careOverdue', value)}
                disabled={!preferences.enabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Meal Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UtensilsCrossed size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Meal Reminders</Text>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Meal Time Reminders</Text>
                <Text style={styles.settingDescription}>
                  Remind me 15 minutes before scheduled meals
                </Text>
              </View>
              <Switch
                value={preferences.enabled && preferences.mealReminders}
                onValueChange={(value) => handleToggleCategory('mealReminders', value)}
                disabled={!preferences.enabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Missed Meal Alerts</Text>
                <Text style={styles.settingDescription}>
                  Alert me 30 minutes after meals if not marked as fed
                </Text>
              </View>
              <Switch
                value={preferences.enabled && preferences.missedMeals}
                onValueChange={(value) => handleToggleCategory('missedMeals', value)}
                disabled={!preferences.enabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Diet Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color={colors.primary[500]} />
            <Text style={styles.sectionTitle}>Diet Alerts</Text>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Pattern Alerts</Text>
                <Text style={styles.settingDescription}>
                  Alert me about concerning eating patterns (refusals, skipped meals)
                </Text>
              </View>
              <Switch
                value={preferences.enabled && preferences.dietAlerts}
                onValueChange={(value) => handleToggleCategory('dietAlerts', value)}
                disabled={!preferences.enabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Info size={20} color={colors.primary[500]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Notifications</Text>
              <Text style={styles.infoText}>
                • Notifications help you stay on top of pet care tasks{'\n'}
                • Tap any notification to go directly to the relevant pet{'\n'}
                • Disable categories you don't need{'\n'}
                • All settings are saved automatically
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewScheduled}>
            <Clock size={20} color={colors.primary[500]} />
            <Text style={styles.secondaryButtonText}>View Scheduled Notifications</Text>
          </TouchableOpacity>

          {scheduledCount > 0 && (
            <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
              <BellOff size={20} color={colors.status.urgent} />
              <Text style={styles.dangerButtonText}>Clear All Notifications</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[500],
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.md,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[500],
    marginBottom: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primary[500],
    fontSize: 15,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.status.urgent,
  },
  dangerButtonText: {
    color: colors.status.urgent,
    fontSize: 15,
    fontWeight: '600',
  },
});
