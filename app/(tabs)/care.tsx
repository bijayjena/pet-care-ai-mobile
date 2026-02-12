import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Heart, Pill, Syringe, Scissors, Bath, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { usePets } from '@/contexts/PetContext';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';
import type { CareCategory } from '@/types/care';

const careCategories = [
  { id: '1', icon: Pill, label: 'Medications', category: 'medication' as CareCategory, color: colors.primary[600] },
  { id: '2', icon: Syringe, label: 'Vaccinations', category: 'vaccination' as CareCategory, color: colors.status.healthy },
  { id: '3', icon: Scissors, label: 'Grooming', category: 'grooming' as CareCategory, color: colors.status.caution },
  { id: '4', icon: Bath, label: 'Hygiene', category: 'hygiene' as CareCategory, color: colors.primary[500] },
  { id: '5', icon: Calendar, label: 'Appointments', category: 'appointment' as CareCategory, color: colors.status.urgent },
  { id: '6', icon: Heart, label: 'Wellness', category: 'wellness' as CareCategory, color: colors.status.healthy },
];

export default function CareScreen() {
  const { pets, upcomingCareTasks, completeCareTask, careHistory } = usePets();

  const handleCompleteTask = async (taskId: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeCareTask(taskId);
  };

  const getCategoryCount = (category: CareCategory) => {
    return upcomingCareTasks.filter(task => task.category === category).length;
  };

  const getTimeText = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'Overdue';
    if (diff < 60 * 60 * 1000) return 'Due now';
    if (hours < 24) return `In ${hours} hours`;
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `In ${days} days`;
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (weeks === 1) return '1 week ago';
    if (weeks < 4) return `${weeks} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Care & Wellness</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add care task"
            accessibilityRole="button"
            style={styles.addButton}
          >
            <Plus size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Care Categories */}
        <View style={styles.categoriesContainer}>
          {careCategories.map((category) => {
            const IconComponent = category.icon;
            const count = getCategoryCount(category.category);
            
            return (
              <TouchableOpacity
                key={category.id}
                accessible={true}
                accessibilityLabel={`${category.label}, ${count} items`}
                accessibilityRole="button"
                style={styles.categoryCard}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <IconComponent size={24} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryCount}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 UPCOMING CARE ({upcomingCareTasks.length})</Text>
          
          {upcomingCareTasks.map((task) => {
            const pet = pets.find(p => p.id === task.petId);
            if (!pet) return null;

            const isUrgent = task.priority === 'high' || getTimeText(task.dueDate) === 'Due now';
            
            return (
              <TouchableOpacity
                key={task.id}
                accessible={true}
                accessibilityLabel={`${pet.name} ${task.title}`}
                accessibilityRole="button"
                style={[
                  styles.careCard,
                  isUrgent && styles.careCardUrgent,
                ]}
              >
                <View style={styles.careHeader}>
                  <View style={styles.carePet}>
                    <Text style={styles.carePetEmoji}>
                      {pet.type === 'dog' ? '🐕' : '🐈'}
                    </Text>
                    <View style={styles.careInfo}>
                      <Text style={styles.carePetName}>{pet.name}</Text>
                      <Text style={styles.careType}>
                        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {isUrgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.careTitle}>{task.title}</Text>
                <Text style={styles.careDescription}>{task.description}</Text>
                
                <View style={styles.careFooter}>
                  <Text style={[styles.careTime, isUrgent && styles.careTimeUrgent]}>
                    {getTimeText(task.dueDate)}
                  </Text>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteTask(task.id)}
                  >
                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Care History */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.sectionTitle}>📝 RECENT CARE HISTORY</Text>
          
          <View style={styles.historyCard}>
            {careHistory.slice(0, 5).map((item, index) => {
              const pet = pets.find(p => p.id === item.petId);
              if (!pet) return null;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.historyItem,
                    index < Math.min(careHistory.length, 5) - 1 && styles.historyItemBorder,
                  ]}
                >
                  <Text style={styles.historyEmoji}>
                    {pet.type === 'dog' ? '🐕' : '🐈'}
                  </Text>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle}>
                      {pet.name} - {item.title}
                    </Text>
                    <Text style={styles.historyType}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.historyDate}>{getRelativeTime(item.completedAt)}</Text>
                </View>
              );
            })}
          </View>

          {careHistory.length > 5 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All History</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Care & Wellness</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add care task"
            accessibilityRole="button"
            style={styles.addButton}
          >
            <Plus size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {/* Care Categories */}
        <View style={styles.categoriesContainer}>
          {careCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                accessible={true}
                accessibilityLabel={`${category.label}, ${category.count} items`}
                accessibilityRole="button"
                style={styles.categoryCard}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <IconComponent size={24} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 UPCOMING CARE</Text>
          
          {upcomingCare.map((item) => (
            <TouchableOpacity
              key={item.id}
              accessible={true}
              accessibilityLabel={`${item.petName} ${item.title}`}
              accessibilityRole="button"
              style={[
                styles.careCard,
                item.urgent && styles.careCardUrgent,
              ]}
            >
              <View style={styles.careHeader}>
                <View style={styles.carePet}>
                  <Text style={styles.carePetEmoji}>{item.petEmoji}</Text>
                  <View style={styles.careInfo}>
                    <Text style={styles.carePetName}>{item.petName}</Text>
                    <Text style={styles.careType}>{item.type}</Text>
                  </View>
                </View>
                {item.urgent && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>

              <Text style={styles.careTitle}>{item.title}</Text>
              <Text style={styles.careDescription}>{item.description}</Text>
              
              <View style={styles.careFooter}>
                <Text style={[styles.careTime, item.urgent && styles.careTimeUrgent]}>
                  {item.time}
                </Text>
                <TouchableOpacity style={styles.completeButton}>
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Care History */}
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.sectionTitle}>📝 RECENT CARE HISTORY</Text>
          
          <View style={styles.historyCard}>
            {careHistory.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.historyItem,
                  index < careHistory.length - 1 && styles.historyItemBorder,
                ]}
              >
                <Text style={styles.historyEmoji}>{item.petEmoji}</Text>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>
                    {item.petName} - {item.title}
                  </Text>
                  <Text style={styles.historyType}>{item.type}</Text>
                </View>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All History</Text>
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  categoryCard: {
    width: '31%',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
  },
  categoryCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
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
  careCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  careCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
  },
  careHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  carePet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carePetEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  careInfo: {
    gap: spacing.xs,
  },
  carePetName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  careType: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  urgentBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.status.urgent,
    borderRadius: borderRadius.full,
  },
  urgentText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  careTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  careDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  careFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  careTime: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  careTimeUrgent: {
    color: colors.status.urgent,
    fontWeight: typography.weights.semibold,
  },
  completeButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
  },
  completeButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: '#FFFFFF',
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  historyType: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  historyDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
  },
  viewAllButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
});
