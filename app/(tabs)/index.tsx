import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Pill, Calendar, AlertCircle, TrendingUp, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { EmergencyModal } from '@/components/EmergencyModal';
import { usePets } from '@/contexts/PetContext';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { pets, activeReminders, completeReminder, healthScore } = usePets();
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! 👋';
    if (hour < 18) return 'Good Afternoon! 👋';
    return 'Good Evening! 👋';
  };

  const handleReminderPress = async (reminderId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    completeReminder(reminderId);
  };

  const handleEmergency = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setEmergencyModalVisible(true);
  };

  const handleQuickAction = async (action: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (action) {
      case 'symptom':
        router.push('/(tabs)/assistant');
        break;
      case 'medication':
        router.push('/(tabs)/care');
        break;
      case 'schedule':
        router.push('/(tabs)/care');
        break;
      case 'emergency':
        handleEmergency();
        break;
    }
  };

  const handlePetPress = () => {
    router.push('/(tabs)/pets');
  };

  const getReminderTimeText = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'OVERDUE';
    if (diff < 60 * 60 * 1000) return 'DUE NOW';
    if (hours < 24) return `${hours} hours`;
    if (days === 1) return 'Tomorrow';
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{getGreeting()}</Text>
            <Text style={styles.headerSubtitle}>Here's how your pets are doing</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Activity size={24} color={colors.status.healthy} />
            </View>
            <Text style={styles.statValue}>{pets.length}</Text>
            <Text style={styles.statLabel}>Active Pets</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Pill size={24} color={activeReminders.length > 0 ? colors.status.caution : colors.status.healthy} />
            </View>
            <Text style={styles.statValue}>{activeReminders.length}</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={colors.primary[600]} />
            </View>
            <Text style={styles.statValue}>{healthScore}%</Text>
            <Text style={styles.statLabel}>Health Score</Text>
          </View>
        </View>

        {/* Pet Status Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐾 YOUR PETS</Text>
          
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              accessible={true}
              accessibilityLabel={`View ${pet.name}'s details`}
              accessibilityRole="button"
              style={styles.petCard}
              onPress={handlePetPress}
            >
              <View style={styles.petHeader}>
                <View style={styles.petAvatar}>
                  <Text style={styles.petAvatarText}>{pet.type === 'dog' ? '🐕' : '🐈'}</Text>
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name.toUpperCase()}</Text>
                  <Text style={styles.petDetails}>
                    {pet.breed} • {pet.age}yo
                  </Text>
                </View>
                <View style={[styles.statusBadge, styles.statusHealthy]}>
                  <Text style={styles.statusText}>Healthy</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Reminders */}
        {activeReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ TODAY'S REMINDERS ({activeReminders.length})</Text>
            
            {activeReminders.slice(0, 4).map((reminder) => {
              const pet = pets.find(p => p.id === reminder.petId);
              const isUrgent = reminder.priority === 'high' || getReminderTimeText(reminder.dueDate) === 'DUE NOW';
              
              return (
                <TouchableOpacity
                  key={reminder.id}
                  accessible={true}
                  accessibilityLabel={`${pet?.name} ${reminder.title}`}
                  accessibilityRole="button"
                  style={[styles.reminderCard, isUrgent && styles.reminderUrgent]}
                  onPress={() => handleReminderPress(reminder.id)}
                >
                  <View style={styles.reminderIcon}>
                    {reminder.type === 'medication' ? (
                      <Pill size={20} color={isUrgent ? colors.status.urgent : colors.status.caution} />
                    ) : (
                      <Calendar size={20} color={colors.primary[600]} />
                    )}
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>
                      {pet?.name} - {reminder.title}
                    </Text>
                    <Text style={[styles.reminderTime, isUrgent && styles.reminderTimeUrgent]}>
                      {getReminderTimeText(reminder.dueDate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Take symptom photo"
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={() => handleQuickAction('symptom')}
            >
              <Camera size={24} color={colors.primary[600]} />
              <Text style={styles.actionText}>Symptom</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Log medication"
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={() => handleQuickAction('medication')}
            >
              <Pill size={24} color={colors.primary[600]} />
              <Text style={styles.actionText}>Log Med</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Schedule appointment"
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={() => handleQuickAction('schedule')}
            >
              <Calendar size={24} color={colors.primary[600]} />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Emergency help"
              accessibilityRole="button"
              style={[styles.actionButton, styles.actionEmergency]}
              onPress={() => handleQuickAction('emergency')}
            >
              <AlertCircle size={24} color={colors.status.urgent} />
              <Text style={[styles.actionText, styles.actionEmergencyText]}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.sectionTitle}>📝 RECENT ACTIVITY</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>• Max - Morning walk completed - 2h ago</Text>
            <Text style={styles.activityText}>• Luna - Grooming session - 1d ago</Text>
            <Text style={styles.activityText}>• Max - Weight recorded: 42 lbs - 2d ago</Text>
            <Text style={styles.activityText}>• Luna - Medication logged - 3d ago</Text>
          </View>
        </View>
      </ScrollView>

      <EmergencyModal
        visible={emergencyModalVisible}
        onClose={() => setEmergencyModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  petCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  petAvatarText: {
    fontSize: 32,
  },
  petInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  petName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  petDetails: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusHealthy: {
    backgroundColor: colors.status.healthy + '20',
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.status.healthy,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  reminderUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  reminderTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  reminderTime: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  reminderTimeUrgent: {
    color: colors.status.urgent,
    fontWeight: typography.weights.semibold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    height: touchTargets.large * 1.5,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  actionEmergency: {
    borderWidth: 2,
    borderColor: colors.status.urgent,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  actionEmergencyText: {
    color: colors.status.urgent,
  },
  activityCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  activityText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
});
