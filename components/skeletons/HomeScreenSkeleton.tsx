import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonStatCard, SkeletonCard, SkeletonListItem } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function HomeScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SkeletonTitle width="60%" />
          <View style={{ height: spacing.xs }} />
          <SkeletonText width="40%" />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>

        {/* Pet Status Cards */}
        <View style={styles.section}>
          <SkeletonText width={120} />
          <View style={{ height: spacing.md }} />
          <SkeletonCard />
          <SkeletonCard />
        </View>

        {/* Today's Actions */}
        <View style={styles.section}>
          <SkeletonText width={140} />
          <View style={{ height: spacing.md }} />
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <SkeletonText width={120} />
          <View style={{ height: spacing.md }} />
          <View style={styles.actionsGrid}>
            <SkeletonLoader width="48%" height={100} />
            <SkeletonLoader width="48%" height={100} />
            <SkeletonLoader width="48%" height={100} />
            <SkeletonLoader width="48%" height={100} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
