import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/contexts/PetContext.supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { User, LogOut, Database, Shield, Info, Trash2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut, isConfigured } = useAuth();
  const { pets, isOnline, clearAllData } = usePets();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will reset the app to mock data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>
            {user?.email || 'Offline Mode'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isOnline ? 'Online Mode' : 'Offline Mode'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <InfoRow
            icon={<User size={20} color="#3B82F6" />}
            label="Email"
            value={user?.email || 'Not signed in'}
          />
          
          <InfoRow
            icon={<Database size={20} color="#3B82F6" />}
            label="Mode"
            value={isOnline ? 'Online (Supabase)' : 'Offline (Mock Data)'}
          />
          
          <InfoRow
            icon={<Shield size={20} color="#3B82F6" />}
            label="Authentication"
            value={isConfigured ? 'Google OAuth' : 'Not configured'}
          />
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.statsGrid}>
            <StatCard label="Pets" value={pets.length} />
            <StatCard label="Mode" value={isOnline ? 'Cloud' : 'Local'} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          {user && isConfigured && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          )}

          {!isOnline && (
            <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
              <Trash2 size={20} color="#F59E0B" />
              <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>
                Clear All Data
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <InfoRow
            icon={<Info size={20} color="#3B82F6" />}
            label="Version"
            value="2.0.0"
          />
          
          <InfoRow
            icon={<Info size={20} color="#3B82F6" />}
            label="Build"
            value="Supabase + Google OAuth"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pet Care AI</Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for pet lovers
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowLeft}>
        {icon}
        <Text style={styles.infoRowLabel}>{label}</Text>
      </View>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoRowLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoRowValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});
