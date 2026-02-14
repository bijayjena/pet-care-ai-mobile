import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, AlertCircle } from 'lucide-react-native';
import { notificationService } from '@/services/notificationService';
import * as Notifications from 'expo-notifications';
import { colors } from '@/constants/theme';

export function NotificationSettings() {
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
        'Please enable notifications in your device settings to receive care and meal reminders.'
      );
    }
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Bell size={24} color={colors.primary[500]} />
          <Text style={styles.title}>Notification Settings</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Permission Status:</Text>
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
            <Text style={styles.primaryButtonText}>Enable Notifications</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <AlertCircle size={20} color={colors.primary[500]} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What you'll receive:</Text>
            <Text style={styles.infoText}>• Care task reminders (1 hour before due)</Text>
            <Text style={styles.infoText}>• Overdue care task alerts</Text>
            <Text style={styles.infoText}>• Meal reminders (15 minutes before)</Text>
            <Text style={styles.infoText}>• Missed meal notifications</Text>
            <Text style={styles.infoText}>• Diet pattern alerts</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewScheduled}>
            <Clock size={20} color={colors.primary[500]} />
            <Text style={styles.secondaryButtonText}>View Scheduled</Text>
          </TouchableOpacity>

          {scheduledCount > 0 && (
            <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
              <BellOff size={20} color={colors.status.urgent} />
              <Text style={styles.dangerButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[500],
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 6,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  secondaryButtonText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.status.urgent,
  },
  dangerButtonText: {
    color: colors.status.urgent,
    fontSize: 16,
    fontWeight: '600',
  },
});
