import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function ConnectionStatus() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check connection status
    const checkConnection = async () => {
      if (!isSupabaseConfigured() || !user) {
        setIsOnline(false);
        setShowStatus(true);
        return;
      }

      try {
        // Simple connectivity check
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsOnline(response.ok);
        setShowStatus(!response.ok);
      } catch (error) {
        setIsOnline(false);
        setShowStatus(true);
      }
    };

    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [user]);

  if (!showStatus) return null;

  return (
    <View style={[styles.container, isOnline ? styles.online : styles.offline]}>
      {isOnline ? (
        <>
          <Wifi size={16} color={colors.success[700]} />
          <Text style={[styles.text, styles.onlineText]}>Connected</Text>
        </>
      ) : (
        <>
          <WifiOff size={16} color={colors.error[700]} />
          <Text style={[styles.text, styles.offlineText]}>
            No connection - Some features may be limited
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  online: {
    backgroundColor: colors.success[50],
  },
  offline: {
    backgroundColor: colors.error[50],
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  onlineText: {
    color: colors.success[700],
  },
  offlineText: {
    color: colors.error[700],
  },
});
