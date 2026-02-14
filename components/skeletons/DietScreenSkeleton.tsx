import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonCircle, SkeletonStatCard } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function DietScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SkeletonTitle width="60%" />
          <SkeletonCircle size={44} />
        </View>

        {/* Daily Summary */}
        <View style={styles.summaryContainer}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <SkeletonText width={140} />
          <View style={{ height: spacing.md }} />
          
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealPet}>
                  <SkeletonCircle size={32} />
                  <View style={styles.mealInfo}>
                    <SkeletonText width={80} />
                    <View style={{ height: spacing.xs }} />
                    <SkeletonText width={60} />
                  </View>
                </View>
                <SkeletonLoader width={70} height={28} borderRadius={borderRadius.full} />
              </View>

              <View style={styles.mealDetails}>
                <SkeletonText width="100%" />
                <View style={{ height: spacing.sm }} />
                <SkeletonText width="80%" />
                <View style={{ height: spacing.sm }} />
                <SkeletonText width="60%" />
              </View>

              <View style={styles.actionButtons}>
                <SkeletonLoader width="32%" height={44} />
                <SkeletonLoader width="32%" height={44} />
                <SkeletonLoader width="32%" height={44} />
              </View>
            </View>
          ))}
        </View>

        {/* Nutrition Tips */}
        <View style={styles.section}>
          <SkeletonText width={140} />
          <View style={{ height: spacing.md }} />
          
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.tipCard}>
              <SkeletonCircle size={32} />
              <View style={styles.tipContent}>
                <SkeletonText width="70%" />
                <View style={{ height: spacing.xs }} />
                <SkeletonText width="100%" />
              </View>
            </View>
          ))}
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  mealCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mealPet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealInfo: {
    marginLeft: spacing.md,
  },
  mealDetails: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  tipContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
