import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type AuthMode = 'signin' | 'signup';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isConfigured } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailAuth, setShowEmailAuth] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
        Alert.alert(
          'Check Your Email',
          'We sent you a verification link. Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => setMode('signin') }]
        );
      } else {
        await signInWithEmail(email, password);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      
      let errorMessage = 'Authentication failed';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email first';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please sign in.';
      }
      
      Alert.alert('Error', errorMessage);
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.emoji}>🐾</Text>
            <Text style={styles.title}>Pet Care AI</Text>
            <Text style={styles.subtitle}>
              Your AI-powered companion for pet health and wellness
            </Text>

            {!showEmailAuth ? (
              <>
                <View style={styles.features}>
                  <FeatureItem icon="💊" text="Track medications & care" />
                  <FeatureItem icon="🍖" text="Manage diet & nutrition" />
                  <FeatureItem icon="🤖" text="Get AI health advice" />
                  <FeatureItem icon="🔔" text="Smart reminders" />
                </View>

                <TouchableOpacity
                  style={[styles.googleButton, loading && styles.buttonDisabled]}
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#1F2937" />
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
                  style={[styles.emailButton, loading && styles.buttonDisabled]}
                  onPress={() => setShowEmailAuth(true)}
                  disabled={loading}
                >
                  <Text style={styles.emailButtonText}>Continue with Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.offlineButton}
                  onPress={handleContinueOffline}
                  disabled={loading}
                >
                  <Text style={styles.offlineButtonText}>Continue Offline</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.authForm}>
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[styles.tab, mode === 'signin' && styles.tabActive]}
                      onPress={() => setMode('signin')}
                    >
                      <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, mode === 'signup' && styles.tabActive]}
                      onPress={() => setMode('signup')}
                    >
                      <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Password (min 8 characters)"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleEmailAuth}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowEmailAuth(false)}
                    disabled={loading}
                  >
                    <Text style={styles.backButtonText}>← Back to options</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: '100%',
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
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  features: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  emailButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  authForm: {
    width: '100%',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#1F2937',
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
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
