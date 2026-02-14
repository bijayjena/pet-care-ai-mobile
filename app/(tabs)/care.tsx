import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Syringe, Bug, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePets } from '@/contexts/PetContext';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';
import type { CareStatus } from '@/types/care';

export default function CareScreen() {
  const { pets, vaccines, dewormingRecords, completeVaccine, completeDeworming } = usePets();

  const handleCompleteVaccine = async (id: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeVaccine(id);
  };

  const handleCompleteDeworming = async (id: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeDeworming(id);
  };

  const getVaccineStats = () => {
    const overdue = vaccines.filter(v => v.status === 'overdue').length;
    const due = vaccines.filter(v => v.status === 'due').length;
    const completed = vaccines.filter(v => v.status === 'completed').length;
    return { overdue, due, completed, total: vaccines.length };
  };

  const getDewormingStats = () => {
    const overdue = dewormingRecords.filter(d => d.status === 'overdue').length;
    const due = dewormingRecords.filter(d => d.status === 'due').length;
    const completed = dewormingRecords.filter(d => d.status === 'completed').length;
    return { overdue, due, completed, total: dewormingRecords.length };
  };

  const getStatusColor = (status: CareStatus) => {
    switch (status) {
      case 'completed':
        return colors.status.healthy;
      case 'due':
        return colors.status.caution;
      case 'overdue':
        return colors.status.urgent;
      case 'upcoming':
        return colors.primary[600];
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: CareStatus) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'due':
        return Clock;
      case 'overdue':
        return AlertCircle;
      case 'upcoming':
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusLabel = (status: CareStatus) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'due':
        return 'Due Now';
      case 'overdue':
        return 'Overdue';
      case 'upcoming':
        return 'Upcoming';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Sort vaccines by status priority
  const sortedVaccines = [...vaccines].sort((a, b) => {
    const statusOrder = { overdue: 0, due: 1, upcoming: 2, completed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    // Within same status, sort by date
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  // Sort deworming by status priority
  const sortedDeworming = [...dewormingRecords].sort((a, b) => {
    const statusOrder = { overdue: 0, due: 1, upcoming: 2, completed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    // Within same status, sort by date
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  const vaccineStats = getVaccineStats();
  const dewormingStats = getDewormingStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Care Tracker</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add care record"
            accessibilityRole="button"
            style={styles.addButton}
          >
            <Plus size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Vaccines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Syringe size={20} color={colors.primary[600]} />
              <Text style={styles.sectionTitle}>VACCINATIONS</Text>
            </View>
            <View style={styles.statsContainer}>
              {vaccineStats.overdue > 0 && (
                <View style={[styles.statBadge, styles.statOverdue]}>
                  <Text style={styles.statBadgeText}>{vaccineStats.overdue} overdue</Text>
                </View>
              )}
              {vaccineStats.due > 0 && (
                <View style={[styles.statBadge, styles.statDue]}>
                  <Text style={styles.statBadgeText}>{vaccineStats.due} due</Text>
                </View>
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{vaccineStats.total}</Text>
              </View>
            </View>
          </View>

          {sortedVaccines.map((vaccine) => {
            const pet = pets.find(p => p.id === vaccine.petId);
            if (!pet) return null;

            const StatusIcon = getStatusIcon(vaccine.status);
            const statusColor = getStatusColor(vaccine.status);

            return (
              <View
                key={vaccine.id}
                style={[
                  styles.card,
                  vaccine.status === 'overdue' && styles.cardOverdue,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petEmoji}>
                      {pet.type === 'dog' ? '🐕' : '🐈'}
                    </Text>
                    <View style={styles.petDetails}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.vaccineName}>{vaccine.name}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={14} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {getStatusLabel(vaccine.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Due Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(vaccine.dueDate)}</Text>
                  </View>
                  {vaccine.completedAt && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Completed:</Text>
                      <Text style={styles.infoValue}>{formatDate(vaccine.completedAt)}</Text>
                    </View>
                  )}
                  {vaccine.notes && (
                    <Text style={styles.notes}>{vaccine.notes}</Text>
                  )}
                </View>

                {vaccine.status !== 'completed' && (
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Mark vaccine as completed"
                    accessibilityRole="button"
                    style={styles.completeButton}
                    onPress={() => handleCompleteVaccine(vaccine.id)}
                    activeOpacity={0.7}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Deworming Section */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Bug size={20} color={colors.status.caution} />
              <Text style={styles.sectionTitle}>DEWORMING</Text>
            </View>
            <View style={styles.statsContainer}>
              {dewormingStats.overdue > 0 && (
                <View style={[styles.statBadge, styles.statOverdue]}>
                  <Text style={styles.statBadgeText}>{dewormingStats.overdue} overdue</Text>
                </View>
              )}
              {dewormingStats.due > 0 && (
                <View style={[styles.statBadge, styles.statDue]}>
                  <Text style={styles.statBadgeText}>{dewormingStats.due} due</Text>
                </View>
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{dewormingStats.total}</Text>
              </View>
            </View>
          </View>

          {sortedDeworming.map((record) => {
            const pet = pets.find(p => p.id === record.petId);
            if (!pet) return null;

            const StatusIcon = getStatusIcon(record.status);
            const statusColor = getStatusColor(record.status);

            return (
              <View
                key={record.id}
                style={[
                  styles.card,
                  record.status === 'overdue' && styles.cardOverdue,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petEmoji}>
                      {pet.type === 'dog' ? '🐕' : '🐈'}
                    </Text>
                    <View style={styles.petDetails}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.vaccineName}>Deworming Treatment</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <StatusIcon size={14} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {getStatusLabel(record.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Due Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(record.dueDate)}</Text>
                  </View>
                  {record.completedAt && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Completed:</Text>
                      <Text style={styles.infoValue}>{formatDate(record.completedAt)}</Text>
                    </View>
                  )}
                  {record.weight && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Weight:</Text>
                      <Text style={styles.infoValue}>{record.weight} lbs</Text>
                    </View>
                  )}
                  {record.notes && (
                    <Text style={styles.notes}>{record.notes}</Text>
                  )}
                </View>

                {record.status !== 'completed' && (
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Mark deworming as completed"
                    accessibilityRole="button"
                    style={styles.completeButton}
                    onPress={() => handleCompleteDeworming(record.id)}
                    activeOpacity={0.7}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  addButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statOverdue: {
    backgroundColor: colors.status.urgent + '20',
  },
  statDue: {
    backgroundColor: colors.status.caution + '20',
  },
  statBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  petEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  vaccineName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  cardBody: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  notes: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  completeButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
});
