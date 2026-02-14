import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { signInWithGoogle, isConfigured } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOffline = () => {
    router.replace('/(tabs)');
  };

  if (!isConfigured) {
    return (
      <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🐾</Text>
          <Text style={styles.title}>Pet Care AI</Text>
          <Text style={styles.subtitle}>Offline Mode</Text>
          
          <View style={styles.offlineCard}>
            <Text style={styles.offlineText}>
              Supabase is not configured. The app will run in offline mode with mock data.
            </Text>
            <Text style={styles.offlineSubtext}>
              To enable online features, add your Supabase credentials to the .env file.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueOffline}
          >
            <Text style={styles.continueButtonText}>Continue with Mock Data</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>Pet Care AI</Text>
        <Text style={styles.subtitle}>
          Your AI-powered companion for pet health and wellness
        </Text>

        <View style={styles.features}>
          <FeatureItem icon="💊" text="Track medications & care" />
          <FeatureItem icon="🍖" text="Manage diet & nutrition" />
          <FeatureItem icon="🤖" text="Get AI health advice" />
          <FeatureItem icon="🔔" text="Smart reminders" />
        </View>

        <TouchableOpacity
          style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.offlineButton}
          onPress={handleContinueOffline}
          disabled={loading}
        >
          <Text style={styles.offlineButtonText}>Continue Offline</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </LinearGradient>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  offlineButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
  },
  offlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E7FF',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#C7D2FE',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  offlineCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  offlineText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  offlineSubtext: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
});
