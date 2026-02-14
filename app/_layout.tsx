import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useNotifications } from '@/hooks/useNotifications';
import { useAppLifecycleTracking } from '@/hooks/useAnalytics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PetProvider } from '@/contexts/PetContext';
import { NotificationPreferencesProvider } from '@/contexts/NotificationPreferencesContext';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function AppContent() {
  useNotifications();
  useAppLifecycleTracking();

  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
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
        <PetProvider>
          <NotificationPreferencesProvider>
            <AppContent />
            <StatusBar style="auto" />
          </NotificationPreferencesProvider>
        </PetProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
