import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '@/constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius: customBorderRadius = borderRadius.md,
  style 
}: SkeletonLoaderProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: customBorderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Preset skeleton components
export function SkeletonCircle({ size = 48 }: { size?: number }) {
  return (
    <SkeletonLoader
      width={size}
      height={size}
      borderRadius={size / 2}
    />
  );
}

export function SkeletonText({ width = '100%' }: { width?: number | string }) {
  return <SkeletonLoader width={width} height={16} />;
}

export function SkeletonTitle({ width = '60%' }: { width?: number | string }) {
  return <SkeletonLoader width={width} height={24} />;
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonCircle size={56} />
        <View style={styles.cardInfo}>
          <SkeletonTitle width="70%" />
          <View style={{ height: spacing.xs }} />
          <SkeletonText width="50%" />
        </View>
      </View>
      <View style={{ height: spacing.md }} />
      <SkeletonText width="100%" />
      <View style={{ height: spacing.xs }} />
      <SkeletonText width="80%" />
    </View>
  );
}

export function SkeletonStatCard() {
  return (
    <View style={styles.statCard}>
      <SkeletonCircle size={48} />
      <View style={{ height: spacing.sm }} />
      <SkeletonLoader width={40} height={28} />
      <View style={{ height: spacing.xs }} />
      <SkeletonText width="80%" />
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <SkeletonCircle size={40} />
      <View style={styles.listItemContent}>
        <SkeletonText width="70%" />
        <View style={{ height: spacing.xs }} />
        <SkeletonText width="50%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.neutral[200],
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
