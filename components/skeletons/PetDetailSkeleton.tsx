import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonCircle } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function PetDetailSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SkeletonCircle size={44} />
          <SkeletonTitle width={120} />
          <SkeletonCircle size={44} />
        </View>

        {/* Pet Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <SkeletonCircle size={80} />
            <View style={styles.profileInfo}>
              <SkeletonTitle width="70%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="60%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="50%" />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <SkeletonCircle size={24} />
            <View style={{ height: spacing.sm }} />
            <SkeletonText width={60} />
            <View style={{ height: spacing.xs }} />
            <SkeletonText width={40} />
          </View>
          <View style={styles.statCard}>
            <SkeletonCircle size={24} />
            <View style={{ height: spacing.sm }} />
            <SkeletonText width={60} />
            <View style={{ height: spacing.xs }} />
            <SkeletonText width={50} />
          </View>
          <View style={styles.statCard}>
            <SkeletonCircle size={24} />
            <View style={{ height: spacing.sm }} />
            <SkeletonText width={60} />
            <View style={{ height: spacing.xs }} />
            <SkeletonText width={55} />
          </View>
        </View>

        {/* Health Information */}
        <View style={styles.section}>
          <SkeletonText width={180} />
          <View style={{ height: spacing.md }} />
          <View style={styles.infoCard}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.infoRow}>
                <SkeletonText width={100} />
                <SkeletonText width={120} />
              </View>
            ))}
          </View>
        </View>

        {/* Active Medications */}
        <View style={styles.section}>
          <SkeletonText width={160} />
          <View style={{ height: spacing.md }} />
          <View style={styles.medicationsCard}>
            {[1, 2].map((i) => (
              <View key={i} style={styles.medicationItem}>
                <SkeletonCircle size={8} />
                <View style={styles.medicationInfo}>
                  <SkeletonText width={140} />
                  <View style={{ height: spacing.xs }} />
                  <SkeletonText width={100} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Vet Contact */}
        <View style={styles.section}>
          <SkeletonText width={140} />
          <View style={{ height: spacing.md }} />
          <View style={styles.vetCard}>
            <SkeletonTitle width="60%" />
            <View style={{ height: spacing.xs }} />
            <SkeletonText width="50%" />
            <View style={{ height: spacing.xs }} />
            <SkeletonText width="40%" />
            
            <View style={styles.vetActions}>
              <SkeletonLoader width="30%" height={48} />
              <SkeletonLoader width="30%" height={48} />
              <SkeletonLoader width="30%" height={48} />
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: spacing.lg,
    flex: 1,
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
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  medicationsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  medicationInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  vetCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  vetActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
