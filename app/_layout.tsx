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
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function AppContent() {
  const { user, loading, isConfigured } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useNotifications();
  useAppLifecycleTracking();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    // If not configured or not logged in, redirect to login
    // But allow access to app if offline mode
    if (!user && !inAuthGroup && isConfigured) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, isConfigured]);

  if (loading) {
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
