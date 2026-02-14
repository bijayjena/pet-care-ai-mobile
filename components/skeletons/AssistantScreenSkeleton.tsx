import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonLoader, SkeletonTitle, SkeletonText, SkeletonCircle } from '../SkeletonLoader';
import { colors, spacing, borderRadius } from '@/constants/theme';

export function AssistantScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <SkeletonCircle size={48} />
            <View style={styles.headerInfo}>
              <SkeletonTitle width={120} />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width={100} />
            </View>
          </View>
        </View>

        {/* Quick Prompts */}
        <View style={styles.quickPromptsContainer}>
          <SkeletonText width={120} />
          <View style={{ height: spacing.sm }} />
          <View style={styles.quickPrompts}>
            <SkeletonLoader width={140} height={36} borderRadius={borderRadius.full} />
            <SkeletonLoader width={120} height={36} borderRadius={borderRadius.full} />
            <SkeletonLoader width={130} height={36} borderRadius={borderRadius.full} />
            <SkeletonLoader width={150} height={36} borderRadius={borderRadius.full} />
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {/* AI Message */}
          <View style={styles.aiMessageWrapper}>
            <View style={styles.messageBubble}>
              <SkeletonText width="100%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="90%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="80%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="70%" />
            </View>
          </View>

          {/* User Message */}
          <View style={styles.userMessageWrapper}>
            <View style={[styles.messageBubble, styles.userMessage]}>
              <SkeletonText width="100%" />
            </View>
          </View>

          {/* AI Message */}
          <View style={styles.aiMessageWrapper}>
            <View style={styles.messageBubble}>
              <SkeletonText width="100%" />
              <View style={{ height: spacing.xs }} />
              <SkeletonText width="85%" />
            </View>
          </View>
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <SkeletonCircle size={44} />
          <SkeletonLoader width="60%" height={44} borderRadius={borderRadius.full} />
          <SkeletonCircle size={44} />
          <SkeletonCircle size={44} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  quickPromptsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
  },
  messageWrapper: {
    marginBottom: spacing.lg,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  userMessage: {
    backgroundColor: colors.primary[100],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
});
