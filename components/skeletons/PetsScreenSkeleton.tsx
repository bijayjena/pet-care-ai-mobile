import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonCircle } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function PetsScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SkeletonTitle width="40%" />
          <SkeletonLoader width={100} height={36} borderRadius={borderRadius.md} />
        </View>

        {/* Pet Cards */}
        {[1, 2].map((i) => (
          <View key={i} style={styles.petCard}>
            <View style={styles.petHeader}>
              <SkeletonCircle size={72} />
              <View style={styles.petInfo}>
                <SkeletonTitle width="60%" />
                <View style={{ height: spacing.xs }} />
                <SkeletonText width="50%" />
                <View style={{ height: spacing.xs }} />
                <SkeletonText width="40%" />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.petStats}>
              <SkeletonText width="70%" />
              <View style={{ height: spacing.sm }} />
              <SkeletonText width="60%" />
            </View>

            <View style={styles.petActions}>
              <SkeletonLoader width="30%" height={40} borderRadius={borderRadius.full} />
              <SkeletonLoader width="30%" height={40} borderRadius={borderRadius.full} />
              <SkeletonLoader width="30%" height={40} borderRadius={borderRadius.full} />
            </View>

            <SkeletonLoader width="100%" height={44} />
          </View>
        ))}
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
  petCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.lg,
  },
  petStats: {
    marginBottom: spacing.md,
  },
  petActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
