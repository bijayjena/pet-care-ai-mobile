import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonCircle } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function CareScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SkeletonTitle width="50%" />
          <SkeletonCircle size={44} />
        </View>

        {/* Vaccines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SkeletonText width={140} />
            <SkeletonLoader width={60} height={24} borderRadius={borderRadius.full} />
          </View>

          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.petInfo}>
                  <SkeletonCircle size={32} />
                  <View style={styles.petDetails}>
                    <SkeletonText width={80} />
                    <View style={{ height: spacing.xs }} />
                    <SkeletonText width={120} />
                  </View>
                </View>
                <SkeletonLoader width={80} height={28} borderRadius={borderRadius.full} />
              </View>

              <View style={styles.cardBody}>
                <SkeletonText width="100%" />
                <View style={{ height: spacing.sm }} />
                <SkeletonText width="80%" />
              </View>

              <SkeletonLoader width="100%" height={44} />
            </View>
          ))}
        </View>

        {/* Deworming Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SkeletonText width={120} />
            <SkeletonLoader width={60} height={24} borderRadius={borderRadius.full} />
          </View>

          {[1, 2].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.petInfo}>
                  <SkeletonCircle size={32} />
                  <View style={styles.petDetails}>
                    <SkeletonText width={80} />
                    <View style={{ height: spacing.xs }} />
                    <SkeletonText width={140} />
                  </View>
                </View>
                <SkeletonLoader width={80} height={28} borderRadius={borderRadius.full} />
              </View>

              <View style={styles.cardBody}>
                <SkeletonText width="100%" />
                <View style={{ height: spacing.sm }} />
                <SkeletonText width="70%" />
              </View>

              <SkeletonLoader width="100%" height={44} />
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
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
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
  petDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardBody: {
    marginBottom: spacing.md,
  },
});
