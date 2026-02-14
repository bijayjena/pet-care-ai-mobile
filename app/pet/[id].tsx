import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Activity, Heart } from 'lucide-react-native';
import { usePets } from '@/contexts/PetContext';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

export default function PetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, reminders, careTasks } = usePets();

  const pet = pets.find(p => p.id === id);

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pet not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const petReminders = reminders.filter(r => r.petId === id && !r.completed);
  const petTasks = careTasks.filter(t => t.petId === id && !t.completed);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{pet.name}</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Edit pet"
            accessibilityRole="button"
            style={styles.headerButton}
          >
            <Edit size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Pet Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.petAvatar}>
              <Text style={styles.petAvatarText}>
                {pet.type === 'dog' ? '🐕' : '🐈'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <View style={styles.profileStats}>
                <Text style={styles.profileStat}>{pet.age} years</Text>
                <Text style={styles.profileStatDivider}>•</Text>
                <Text style={styles.profileStat}>{pet.weight} lbs</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Activity size={24} color={colors.status.healthy} />
            <Text style={styles.statValue}>Healthy</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color={colors.primary[600]} />
            <Text style={styles.statValue}>{petReminders.length}</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>
          <View style={styles.statCard}>
            <Heart size={24} color={colors.status.caution} />
            <Text style={styles.statValue}>{petTasks.length}</Text>
            <Text style={styles.statLabel}>Care Tasks</Text>
          </View>
        </View>

        {/* Health Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 HEALTH INFORMATION</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Microchip" value={pet.microchip || 'Not registered'} />
            <InfoRow label="Allergies" value={pet.allergies?.join(', ') || 'None'} />
            <InfoRow label="Conditions" value={pet.conditions?.join(', ') || 'None'} last />
          </View>
        </View>

        {/* Active Medications */}
        {pet.medications && pet.medications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💊 ACTIVE MEDICATIONS</Text>
            <View style={styles.medicationsCard}>
              {pet.medications.filter(m => m.active).map((med, index) => (
                <View
                  key={med.id}
                  style={[
                    styles.medicationItem,
                    index < pet.medications!.filter(m => m.active).length - 1 && styles.medicationItemBorder,
                  ]}
                >
                  <View style={styles.medicationDot} />
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>{med.name}</Text>
                    <Text style={styles.medicationDetails}>
                      {med.dosage} • {med.frequency}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Vet Contact */}
        {pet.vetContact && (
          <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
            <Text style={styles.sectionTitle}>🏥 VETERINARIAN</Text>
            <View style={styles.vetCard}>
              <Text style={styles.vetClinic}>{pet.vetContact.clinicName}</Text>
              <Text style={styles.vetDoctor}>{pet.vetContact.name}</Text>
              <Text style={styles.vetPhone}>{pet.vetContact.phone}</Text>
              
              <View style={styles.vetActions}>
                <TouchableOpacity style={styles.vetActionButton}>
                  <Phone size={20} color={colors.primary[600]} />
                  <Text style={styles.vetActionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.vetActionButton}>
                  <Mail size={20} color={colors.primary[600]} />
                  <Text style={styles.vetActionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.vetActionButton}>
                  <MapPin size={20} color={colors.primary[600]} />
                  <Text style={styles.vetActionText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.xl,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  petAvatarText: {
    fontSize: 48,
  },
  profileInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  petName: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  petBreed: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  profileStat: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
  },
  profileStatDivider: {
    fontSize: typography.sizes.base,
    color: colors.text.tertiary,
    marginHorizontal: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  medicationsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  medicationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  medicationDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.healthy,
  },
  medicationInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  medicationName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  medicationDetails: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  vetCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  vetClinic: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  vetDoctor: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  vetPhone: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  vetActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  vetActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: touchTargets.large,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  vetActionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
});
