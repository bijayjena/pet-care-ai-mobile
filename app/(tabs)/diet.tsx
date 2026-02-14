import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, UtensilsCrossed, Clock, TrendingUp, AlertCircle, Check, X, Ban, MessageSquare } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { usePets } from '@/contexts/PetContext';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

const nutritionTips = [
  {
    id: '1',
    icon: '🥩',
    title: 'Protein-rich diet',
    description: 'Max needs high-quality protein for muscle maintenance',
  },
  {
    id: '2',
    icon: '💧',
    title: 'Stay hydrated',
    description: 'Ensure fresh water is always available',
  },
  {
    id: '3',
    icon: '🚫',
    title: 'Avoid toxic foods',
    description: 'Chocolate, grapes, onions, and garlic are dangerous',
  },
];

export default function DietScreen() {
  const { pets, todaysMeals, completeMeal } = usePets();

  const handleMealAction = async (mealId: string, status: 'fed' | 'skipped' | 'refused') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    completeMeal(mealId, status);
  };

  const completedMeals = todaysMeals.filter(m => m.completed).length;
  const fedMeals = todaysMeals.filter(m => m.status === 'fed').length;
  const totalCalories = todaysMeals
    .filter(m => m.status === 'fed')
    .reduce((sum, m) => sum + m.calories, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Diet & Nutrition</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add meal"
            accessibilityRole="button"
            style={styles.addButton}
          >
            <Plus size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Daily Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <UtensilsCrossed size={24} color={colors.primary[600]} />
            </View>
            <Text style={styles.summaryValue}>
              {fedMeals}/{todaysMeals.length}
            </Text>
            <Text style={styles.summaryLabel}>Meals Fed</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingUp size={24} color={colors.status.healthy} />
            </View>
            <Text style={styles.summaryValue}>{totalCalories}</Text>
            <Text style={styles.summaryLabel}>Total Calories</Text>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ TODAY'S MEALS</Text>
          
          {todaysMeals.map((meal) => {
            const pet = pets.find(p => p.id === meal.petId);
            if (!pet) return null;

            return (
              <TouchableOpacity
                key={meal.id}
                accessible={true}
                accessibilityLabel={`${pet.name} ${meal.mealType}`}
                accessibilityRole="button"
                style={[
                  styles.mealCard,
                  meal.completed && styles.mealCardCompleted,
                ]}
              >
                <View style={styles.mealHeader}>
                  <View style={styles.mealPet}>
                    <Text style={styles.mealPetEmoji}>
                      {pet.type === 'dog' ? '🐕' : '🐈'}
                    </Text>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealPetName}>{pet.name}</Text>
                      <Text style={styles.mealType}>
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {meal.completed ? (
                    <View style={[
                      styles.statusBadge,
                      meal.status === 'fed' && styles.statusBadgeFed,
                      meal.status === 'skipped' && styles.statusBadgeSkipped,
                      meal.status === 'refused' && styles.statusBadgeRefused,
                    ]}>
                      {meal.status === 'fed' && <Check size={14} color={colors.status.healthy} />}
                      {meal.status === 'skipped' && <X size={14} color={colors.text.secondary} />}
                      {meal.status === 'refused' && <Ban size={14} color={colors.status.caution} />}
                      <Text style={[
                        styles.statusText,
                        meal.status === 'fed' && styles.statusTextFed,
                        meal.status === 'skipped' && styles.statusTextSkipped,
                        meal.status === 'refused' && styles.statusTextRefused,
                      ]}>
                        {meal.status === 'fed' && 'Fed'}
                        {meal.status === 'skipped' && 'Skipped'}
                        {meal.status === 'refused' && 'Refused'}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Clock size={14} color={colors.status.caution} />
                      <Text style={styles.pendingText}>{meal.time}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.mealDetails}>
                  <View style={styles.mealDetailRow}>
                    <Text style={styles.mealDetailLabel}>Food:</Text>
                    <Text style={styles.mealDetailValue}>{meal.food}</Text>
                  </View>
                  <View style={styles.mealDetailRow}>
                    <Text style={styles.mealDetailLabel}>Amount:</Text>
                    <Text style={styles.mealDetailValue}>{meal.amount}</Text>
                  </View>
                  <View style={styles.mealDetailRow}>
                    <Text style={styles.mealDetailLabel}>Calories:</Text>
                    <Text style={styles.mealDetailValue}>{meal.calories} kcal</Text>
                  </View>
                </View>

                {!meal.completed && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonFed]}
                      onPress={() => handleMealAction(meal.id, 'fed')}
                      accessible={true}
                      accessibilityLabel="Mark as fed"
                      accessibilityRole="button"
                    >
                      <Check size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Fed</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonSkipped]}
                      onPress={() => handleMealAction(meal.id, 'skipped')}
                      accessible={true}
                      accessibilityLabel="Mark as skipped"
                      accessibilityRole="button"
                    >
                      <X size={16} color={colors.text.secondary} />
                      <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                        Skipped
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonRefused]}
                      onPress={() => handleMealAction(meal.id, 'refused')}
                      accessible={true}
                      accessibilityLabel="Mark as refused"
                      accessibilityRole="button"
                    >
                      <Ban size={16} color={colors.status.caution} />
                      <Text style={[styles.actionButtonText, styles.actionButtonTextCaution]}>
                        Refused
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nutrition Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 NUTRITION TIPS</Text>
          
          {nutritionTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Food Safety Alert */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <TouchableOpacity style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <AlertCircle size={24} color={colors.status.urgent} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Food Safety Guide</Text>
              <Text style={styles.alertDescription}>
                Learn what foods are safe and toxic for your pets
              </Text>
            </View>
          </TouchableOpacity>
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  mealCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mealCardCompleted: {
    opacity: 0.7,
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
  mealPetEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  mealInfo: {
    gap: spacing.xs,
  },
  mealPetName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  mealType: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusBadgeFed: {
    backgroundColor: colors.status.healthy + '20',
  },
  statusBadgeSkipped: {
    backgroundColor: colors.text.secondary + '20',
  },
  statusBadgeRefused: {
    backgroundColor: colors.status.caution + '20',
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  statusTextFed: {
    color: colors.status.healthy,
  },
  statusTextSkipped: {
    color: colors.text.secondary,
  },
  statusTextRefused: {
    color: colors.status.caution,
  },
  completedBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.status.healthy + '20',
    borderRadius: borderRadius.full,
  },
  completedText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.status.healthy,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.status.caution + '20',
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  pendingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.status.caution,
  },
  mealDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  mealDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealDetailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  mealDetailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: touchTargets.minimum,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  actionButtonFed: {
    backgroundColor: colors.primary[600],
  },
  actionButtonSkipped: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.text.secondary + '40',
  },
  actionButtonRefused: {
    backgroundColor: colors.status.caution + '10',
    borderWidth: 1,
    borderColor: colors.status.caution + '40',
  },
  actionButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    color: colors.text.secondary,
  },
  actionButtonTextCaution: {
    color: colors.status.caution,
  },
  logButton: {
    height: touchTargets.minimum,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  tipCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tipDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  alertCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.status.urgent + '10',
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
  },
  alertIcon: {
    marginRight: spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  alertDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
});
