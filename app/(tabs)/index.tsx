import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Camera, 
  Pill, 
  Calendar, 
  AlertCircle, 
  Bell, 
  Sparkles,
  CheckCircle,
  Clock,
  ChevronRight,
  Heart
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

// Mock reminder data
const mockReminders = [
  {
    id: '1',
    petName: 'Max',
    petEmoji: '🐕',
    type: 'medication',
    title: 'Antibiotics',
    description: '250mg tablet, twice daily',
    time: 'Due now',
    urgent: true,
    completed: false,
  },
  {
    id: '2',
    petName: 'Luna',
    petEmoji: '🐈',
    type: 'medication',
    title: 'Flea Prevention',
    description: 'Monthly topical treatment',
    time: 'In 2 hours',
    urgent: false,
    completed: false,
  },
  {
    id: '3',
    petName: 'Max',
    petEmoji: '🐕',
    type: 'appointment',
    title: 'Vet Checkup',
    description: 'Annual wellness exam',
    time: 'Tomorrow, 10:00 AM',
    urgent: false,
    completed: false,
  },
  {
    id: '4',
    petName: 'Luna',
    petEmoji: '🐈',
    type: 'grooming',
    title: 'Nail Trim',
    description: 'Scheduled grooming',
    time: 'Mar 14, 2:00 PM',
    urgent: false,
    completed: false,
  },
];

// Today's actions
const todayActions = [
  {
    id: '1',
    icon: Camera,
    title: 'Check Symptoms',
    description: 'AI-powered symptom analysis',
    color: colors.primary[600],
    route: '/(tabs)/assistant' as const,
  },
  {
    id: '2',
    icon: Sparkles,
    title: 'Ask AI Assistant',
    description: 'Get instant pet care advice',
    color: colors.status.healthy,
    route: '/(tabs)/assistant' as const,
  },
  {
    id: '3',
    icon: Pill,
    title: 'Log Medication',
    description: 'Track daily medications',
    color: colors.status.caution,
    route: '/(tabs)/care' as const,
  },
  {
    id: '4',
    icon: Calendar,
    title: 'Schedule Visit',
    description: 'Book vet appointment',
    color: colors.primary[500],
    route: '/(tabs)/care' as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState(mockReminders);
  
  const handleCompleteReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
    Alert.alert('Success', 'Reminder marked as complete!');
  };

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const urgentReminders = activeReminders.filter(r => r.urgent);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.subtitle}>Here's what needs your attention</Text>
          </View>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="View all notifications"
            accessibilityRole="button"
            style={styles.notificationButton}
          >
            <Bell size={24} color={colors.text.primary} />
            {urgentReminders.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{urgentReminders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Urgent Reminders Alert */}
        {urgentReminders.length > 0 && (
          <View style={styles.urgentAlert}>
            <AlertCircle size={20} color={colors.status.urgent} />
            <Text style={styles.urgentAlertText}>
              {urgentReminders.length} urgent {urgentReminders.length === 1 ? 'reminder' : 'reminders'} need attention
            </Text>
          </View>
        )}

        {/* Upcoming Care Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⏰ Upcoming Care</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionCount}>{activeReminders.length}</Text>
            </View>
          </View>

          {activeReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color={colors.status.healthy} />
              <Text style={styles.emptyStateTitle}>All caught up!</Text>
              <Text style={styles.emptyStateText}>No pending reminders for today</Text>
            </View>
          ) : (
            <>
              {activeReminders.map((reminder) => (
                <View
                  key={reminder.id}
                  style={[
                    styles.reminderCard,
                    reminder.urgent && styles.reminderCardUrgent,
                  ]}
                >
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderPet}>
                      <Text style={styles.reminderPetEmoji}>{reminder.petEmoji}</Text>
                      <View style={styles.reminderInfo}>
                        <Text style={styles.reminderPetName}>{reminder.petName}</Text>
                        <Text style={styles.reminderType}>
                          {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                        </Text>
                      </View>
                    </View>
                    {reminder.urgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>URGENT</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDescription}>{reminder.description}</Text>

                  <View style={styles.reminderFooter}>
                    <View style={styles.reminderTimeContainer}>
                      <Clock size={14} color={reminder.urgent ? colors.status.urgent : colors.text.secondary} />
                      <Text style={[
                        styles.reminderTime,
                        reminder.urgent && styles.reminderTimeUrgent
                      ]}>
                        {reminder.time}
                      </Text>
                    </View>
                    <TouchableOpacity
                      accessible={true}
                      accessibilityLabel={`Mark ${reminder.title} as complete`}
                      accessibilityRole="button"
                      style={styles.completeButton}
                      onPress={() => handleCompleteReminder(reminder.id)}
                    >
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.completeButtonText}>Complete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Today's Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚀 Today's Actions</Text>
          </View>

          <View style={styles.actionsGrid}>
            {todayActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  accessible={true}
                  accessibilityLabel={action.title}
                  accessibilityHint={action.description}
                  accessibilityRole="button"
                  style={styles.actionCard}
                  onPress={() => handleActionPress(action.route)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                    <IconComponent size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                  <ChevronRight size={16} color={colors.text.tertiary} style={styles.actionChevron} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Access to AI Assistant */}
        <View style={styles.section}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Open AI Assistant"
            accessibilityHint="Get instant pet care advice"
            accessibilityRole="button"
            style={styles.aiAssistantCard}
            onPress={() => router.push('/(tabs)/assistant')}
          >
            <View style={styles.aiAssistantContent}>
              <View style={styles.aiAssistantIcon}>
                <Sparkles size={32} color={colors.primary[600]} />
              </View>
              <View style={styles.aiAssistantText}>
                <Text style={styles.aiAssistantTitle}>Need Help?</Text>
                <Text style={styles.aiAssistantDescription}>
                  Ask our AI assistant anything about pet care, health, or nutrition
                </Text>
              </View>
            </View>
            <View style={styles.aiAssistantAction}>
              <Text style={styles.aiAssistantActionText}>Ask Now</Text>
              <ChevronRight size={20} color={colors.primary[600]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Pet Health Summary */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🐾 Your Pets</Text>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="View all pets"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/pets')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.petsContainer}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="View Max's profile"
              accessibilityRole="button"
              style={styles.petSummaryCard}
              onPress={() => router.push('/(tabs)/pets')}
            >
              <View style={styles.petSummaryHeader}>
                <Text style={styles.petSummaryEmoji}>🐕</Text>
                <View style={styles.petSummaryInfo}>
                  <Text style={styles.petSummaryName}>Max</Text>
                  <Text style={styles.petSummaryBreed}>Golden Retriever</Text>
                </View>
                <View style={[styles.petStatusDot, { backgroundColor: colors.status.healthy }]} />
              </View>
              <View style={styles.petSummaryStats}>
                <View style={styles.petSummaryStat}>
                  <Heart size={14} color={colors.text.secondary} />
                  <Text style={styles.petSummaryStatText}>Healthy</Text>
                </View>
                <View style={styles.petSummaryStat}>
                  <Pill size={14} color={colors.text.secondary} />
                  <Text style={styles.petSummaryStatText}>2 meds</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="View Luna's profile"
              accessibilityRole="button"
              style={styles.petSummaryCard}
              onPress={() => router.push('/(tabs)/pets')}
            >
              <View style={styles.petSummaryHeader}>
                <Text style={styles.petSummaryEmoji}>🐈</Text>
                <View style={styles.petSummaryInfo}>
                  <Text style={styles.petSummaryName}>Luna</Text>
                  <Text style={styles.petSummaryBreed}>Persian Cat</Text>
                </View>
                <View style={[styles.petStatusDot, { backgroundColor: colors.status.healthy }]} />
              </View>
              <View style={styles.petSummaryStats}>
                <View style={styles.petSummaryStat}>
                  <Heart size={14} color={colors.text.secondary} />
                  <Text style={styles.petSummaryStatText}>Healthy</Text>
                </View>
                <View style={styles.petSummaryStat}>
                  <Pill size={14} color={colors.text.secondary} />
                  <Text style={styles.petSummaryStatText}>1 med</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  notificationButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.urgent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  urgentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.status.urgent + '15',
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
    gap: spacing.sm,
  },
  urgentAlertText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.status.urgent,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  sectionBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
  },
  sectionCount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptyStateText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  reminderCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  reminderCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
    backgroundColor: colors.status.urgent + '05',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reminderPet: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderPetEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderPetName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  reminderType: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  urgentBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.status.urgent,
    borderRadius: borderRadius.full,
  },
  urgentBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  reminderTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  reminderDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reminderTime: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  reminderTimeUrgent: {
    color: colors.status.urgent,
    fontWeight: typography.weights.semibold,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  completeButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '48%',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    position: 'relative',
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  actionChevron: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  aiAssistantCard: {
    padding: spacing.lg,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary[200],
    ...shadows.sm,
  },
  aiAssistantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiAssistantIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  aiAssistantText: {
    flex: 1,
  },
  aiAssistantTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  aiAssistantDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  aiAssistantAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  aiAssistantActionText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  petsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  petSummaryCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  petSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  petSummaryEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  petSummaryInfo: {
    flex: 1,
  },
  petSummaryName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  petSummaryBreed: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  petStatusDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  petSummaryStats: {
    gap: spacing.sm,
  },
  petSummaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  petSummaryStatText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
});
