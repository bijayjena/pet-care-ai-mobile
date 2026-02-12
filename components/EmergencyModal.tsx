import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';
import { Phone, MapPin, AlertCircle, X } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyModal({ visible, onClose }: EmergencyModalProps) {
  const handlePoisonControl = () => {
    Linking.openURL('tel:8884264435');
  };

  const handleEmergencyVet = () => {
    Linking.openURL('tel:5551234567');
  };

  const handleFindVet = () => {
    Linking.openURL('https://maps.google.com/?q=24+hour+emergency+vet+near+me');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <AlertCircle size={32} color={colors.status.urgent} />
            </View>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Close emergency modal"
              accessibilityRole="button"
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Emergency Help</Text>
          <Text style={styles.subtitle}>
            If your pet is in immediate danger, call now
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Call poison control hotline"
              accessibilityRole="button"
              style={[styles.actionButton, styles.actionButtonUrgent]}
              onPress={handlePoisonControl}
            >
              <Phone size={24} color="#FFFFFF" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Poison Control</Text>
                <Text style={styles.actionSubtitle}>888-426-4435</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Call emergency veterinarian"
              accessibilityRole="button"
              style={[styles.actionButton, styles.actionButtonUrgent]}
              onPress={handleEmergencyVet}
            >
              <Phone size={24} color="#FFFFFF" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Emergency Vet</Text>
                <Text style={styles.actionSubtitle}>Call Now</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Find 24/7 vet clinic nearby"
              accessibilityRole="button"
              style={styles.actionButton}
              onPress={handleFindVet}
            >
              <MapPin size={24} color={colors.primary[600]} />
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, styles.actionTitlePrimary]}>
                  Find 24/7 Vet Clinic
                </Text>
                <Text style={[styles.actionSubtitle, styles.actionSubtitlePrimary]}>
                  Near me
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🚨 Call immediately if:</Text>
            <Text style={styles.infoText}>• Difficulty breathing</Text>
            <Text style={styles.infoText}>• Unconscious or unresponsive</Text>
            <Text style={styles.infoText}>• Severe bleeding</Text>
            <Text style={styles.infoText}>• Seizures</Text>
            <Text style={styles.infoText}>• Suspected poisoning</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.urgent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    ...shadows.sm,
  },
  actionButtonUrgent: {
    backgroundColor: colors.status.urgent,
    borderColor: colors.status.urgent,
  },
  actionContent: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  actionTitlePrimary: {
    color: colors.text.primary,
  },
  actionSubtitle: {
    fontSize: typography.sizes.sm,
    color: '#FFFFFF',
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  actionSubtitlePrimary: {
    color: colors.text.secondary,
  },
  infoBox: {
    padding: spacing.lg,
    backgroundColor: colors.status.urgent + '10',
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.urgent,
  },
  infoTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
});
