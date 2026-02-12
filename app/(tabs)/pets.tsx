import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight, Calendar, Pill, Activity } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

const mockPets = [
  {
    id: '1',
    name: 'Max',
    type: 'dog',
    emoji: '🐕',
    breed: 'Golden Retriever',
    age: '2 years',
    weight: '42 lbs',
    status: 'healthy',
    nextAppointment: 'Mar 15, 2026',
    medications: 2,
  },
  {
    id: '2',
    name: 'Luna',
    type: 'cat',
    emoji: '🐈',
    breed: 'Persian Cat',
    age: '4 years',
    weight: '10 lbs',
    status: 'healthy',
    nextAppointment: 'Apr 2, 2026',
    medications: 1,
  },
];

export default function PetsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Pets</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add new pet"
            accessibilityRole="button"
            style={styles.addButton}
          >
            <Plus size={20} color={colors.primary[600]} />
            <Text style={styles.addButtonText}>Add Pet</Text>
          </TouchableOpacity>
        </View>

        {/* Pet Cards */}
        {mockPets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            accessible={true}
            accessibilityLabel={`View ${pet.name}'s profile`}
            accessibilityRole="button"
            style={styles.petCard}
          >
            <View style={styles.petHeader}>
              <View style={styles.petAvatar}>
                <Text style={styles.petAvatarText}>{pet.emoji}</Text>
              </View>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
                <Text style={styles.petDetails}>
                  {pet.age} • {pet.weight}
                </Text>
              </View>
              <View style={[styles.statusBadge, styles.statusHealthy]}>
                <Text style={styles.statusText}>●</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.petStats}>
              <View style={styles.statItem}>
                <Calendar size={16} color={colors.text.secondary} />
                <Text style={styles.statText}>Next: {pet.nextAppointment}</Text>
              </View>
              <View style={styles.statItem}>
                <Pill size={16} color={colors.text.secondary} />
                <Text style={styles.statText}>{pet.medications} active medications</Text>
              </View>
            </View>

            <View style={styles.petActions}>
              <TouchableOpacity style={styles.actionChip}>
                <Activity size={16} color={colors.primary[600]} />
                <Text style={styles.actionChipText}>Health</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip}>
                <Calendar size={16} color={colors.primary[600]} />
                <Text style={styles.actionChipText}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip}>
                <Pill size={16} color={colors.primary[600]} />
                <Text style={styles.actionChipText}>Meds</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Full Profile</Text>
              <ChevronRight size={16} color={colors.primary[600]} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Add Pet Card */}
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Add a new pet"
          accessibilityRole="button"
          style={[styles.petCard, styles.addPetCard]}
        >
          <View style={styles.addPetContent}>
            <View style={styles.addPetIcon}>
              <Plus size={32} color={colors.primary[600]} />
            </View>
            <Text style={styles.addPetTitle}>Add Another Pet</Text>
            <Text style={styles.addPetSubtitle}>
              Track health and care for all your pets in one place
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: spacing.xxxl }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
    marginLeft: spacing.xs,
  },
  petCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  petAvatarText: {
    fontSize: 40,
  },
  petInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  petName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  petBreed: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  petDetails: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusHealthy: {
    backgroundColor: colors.status.healthy + '20',
  },
  statusText: {
    fontSize: typography.sizes.lg,
    color: colors.status.healthy,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.lg,
  },
  petStats: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  petActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  actionChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  viewProfileText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
  addPetCard: {
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
    backgroundColor: colors.background,
  },
  addPetContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  addPetIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addPetTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addPetSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
