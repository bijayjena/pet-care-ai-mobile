import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

type OnboardingStep = 'welcome' | 'photo' | 'name' | 'type' | 'complete';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<'dog' | 'cat' | null>(null);

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🐾</Text>
            <Text style={styles.heroTitle}>Meet Your Pet's AI Vet</Text>
            <Text style={styles.heroSubtitle}>
              24/7 health guidance, symptom checking, and care reminders—all in your pocket
            </Text>
          </View>

          <View style={styles.features}>
            <FeatureItem icon="📸" text="AI Symptom Checker" />
            <FeatureItem icon="💊" text="Daily Care Reminders" />
            <FeatureItem icon="🚨" text="Emergency Access" />
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Start setup"
            accessibilityRole="button"
            style={styles.primaryButton}
            onPress={() => setStep('photo')}
          >
            <Text style={styles.primaryButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'photo') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>1 of 3</Text>
            <Text style={styles.stepTitle}>Add a photo of your pet</Text>
            <Text style={styles.stepSubtitle}>
              This helps us personalize your experience
            </Text>
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Take pet photo"
            accessibilityHint="Opens camera to take a photo of your pet"
            accessibilityRole="button"
            style={styles.photoButton}
          >
            <Camera size={48} color={colors.primary[600]} />
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Skip photo for now"
              accessibilityRole="button"
              style={styles.secondaryButton}
              onPress={() => setStep('name')}
            >
              <Text style={styles.secondaryButtonText}>Skip for now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Continue to next step"
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={() => setStep('name')}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'name') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>2 of 3</Text>
            <Text style={styles.stepTitle}>What's your pet's name?</Text>
          </View>

          <TextInput
            accessible={true}
            accessibilityLabel="Pet name input"
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor={colors.text.tertiary}
            value={petName}
            onChangeText={setPetName}
            autoFocus
            maxLength={30}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              style={styles.secondaryButton}
              onPress={() => setStep('photo')}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Continue to next step"
              accessibilityRole="button"
              style={[
                styles.primaryButton,
                !petName.trim() && styles.primaryButtonDisabled,
              ]}
              onPress={() => setStep('type')}
              disabled={!petName.trim()}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'type') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>3 of 3</Text>
            <Text style={styles.stepTitle}>Is {petName} a dog or cat?</Text>
          </View>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Select dog"
              accessibilityRole="radio"
              accessibilityState={{ checked: petType === 'dog' }}
              style={[
                styles.typeCard,
                petType === 'dog' && styles.typeCardSelected,
              ]}
              onPress={() => setPetType('dog')}
            >
              <Text style={styles.typeEmoji}>🐕</Text>
              <Text style={styles.typeText}>Dog</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Select cat"
              accessibilityRole="radio"
              accessibilityState={{ checked: petType === 'cat' }}
              style={[
                styles.typeCard,
                petType === 'cat' && styles.typeCardSelected,
              ]}
              onPress={() => setPetType('cat')}
            >
              <Text style={styles.typeEmoji}>🐈</Text>
              <Text style={styles.typeText}>Cat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              style={styles.secondaryButton}
              onPress={() => setStep('name')}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Complete setup"
              accessibilityRole="button"
              style={[
                styles.primaryButton,
                !petType && styles.primaryButtonDisabled,
              ]}
              onPress={() => setStep('complete')}
              disabled={!petType}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Complete step
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>You're all set!</Text>
          <Text style={styles.heroSubtitle}>
            Try the Symptom Checker or ask me anything about {petName}'s care
          </Text>
        </View>

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Go to app"
          accessibilityRole="button"
          style={styles.primaryButton}
          onPress={handleComplete}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxxl,
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.xxxl * 2,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
    paddingHorizontal: spacing.lg,
  },
  features: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  featureText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  stepHeader: {
    marginTop: spacing.xxxl,
  },
  stepNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  stepSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  photoButton: {
    height: 240,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary[600],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
    marginTop: spacing.md,
  },
  input: {
    height: touchTargets.large,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  typeCard: {
    flex: 1,
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  typeCardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[600],
  },
  typeEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  typeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    height: touchTargets.large,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.neutral[300],
  },
  primaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    height: touchTargets.large,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
});
