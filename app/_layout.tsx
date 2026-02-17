import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useNotifications } from '@/hooks/useNotifications';
import { useAppLifecycleTracking } from '@/hooks/useAnalytics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PetProvider } from '@/contexts/PetContext.supabase';
import { NotificationPreferencesProvider } from '@/contexts/NotificationPreferencesContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabaseService } from '@/services/supabaseService';

function AppContent() {
  const { user, loading, isConfigured } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useNotifications();
  useAppLifecycleTracking();

  useEffect(() => {
    if (loading) return;

    const checkAndRedirect = async () => {
      const inAuthGroup = segments[0] === 'login';
      const inOnboarding = segments[0] === 'onboarding';

      // If not configured or not logged in, redirect to login
      if (!user && !inAuthGroup && isConfigured) {
        router.replace('/login');
        setCheckingOnboarding(false);
        return;
      }

      // If logged in, check onboarding status
      if (user && !inAuthGroup && !inOnboarding && isConfigured) {
        try {
          const profile = await supabaseService.getProfile();
          if (!profile?.onboardingCompleted) {
            router.replace('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding:', error);
        }
      }

      if (user && inAuthGroup) {
        router.replace('/(tabs)');
      }

      setCheckingOnboarding(false);
    };

    checkAndRedirect();
  }, [user, loading, segments, isConfigured]);

  if (loading || checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pet/[id]" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="notification-settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <PetProvider>
            <NotificationPreferencesProvider>
              <AppContent />
              <StatusBar style="auto" />
            </NotificationPreferencesProvider>
          </PetProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
