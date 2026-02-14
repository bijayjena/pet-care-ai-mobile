import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, Camera, Mic, ChevronDown, AlertTriangle, Phone, MapPin } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';
import { usePets } from '@/contexts/PetContext';
import { aiService } from '@/services/aiService';
import type { ChatMessage, Pet } from '@/types/pet';

const getInitialMessage = (petName: string, petType: string, breed?: string, age?: number): ChatMessage => ({
  id: '1',
  petId: 'initial',
  role: 'assistant',
  content: `Hi! I'm your AI Pet Care Assistant for ${petName}${breed ? `, your ${age}yo ${breed}` : ''}. I can help you with:\n\n• Health questions and symptoms\n• Diet and nutrition advice\n• Training and behavior tips\n• Emergency guidance\n\nWhat would you like to know about ${petName}?`,
  timestamp: new Date(),
});

const quickPrompts = [
  '🤒 Check symptoms',
  '🍖 Safe foods',
  '🎾 Training tips',
  '💊 Medication help',
];

const quickReplies = {
  diet: [
    'What can they eat?',
    'Portion sizes?',
    'Food allergies?',
    'Treats recommendations',
  ],
  behavior: [
    'Training basics',
    'Stop bad habits',
    'Socialization tips',
    'Anxiety help',
  ],
  care: [
    'Grooming schedule',
    'Exercise needs',
    'Dental care',
    'Nail trimming',
  ],
  health: [
    'Common symptoms',
    'When to call vet?',
    'Preventive care',
    'Vaccination schedule',
  ],
};

// Emergency keywords that trigger urgent response
const emergencyKeywords = [
  'bleeding', 'blood', 'seizure', 'convulsion', 'unconscious', 'unresponsive',
  'choking', 'breathing', 'poison', 'toxic', 'ate chocolate', 'ate grapes',
  'ate onion', 'ate garlic', 'ate xylitol', 'hit by car', 'accident',
  'broken bone', 'fracture', 'collapse', 'can\'t stand', 'paralyzed',
  'vomiting blood', 'bloody stool', 'bloated', 'distended', 'pale gums',
  'blue gums', 'difficulty breathing', 'gasping', 'emergency', 'dying',
];

export default function AssistantScreen() {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState<keyof typeof quickReplies | null>(null);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize with first pet
  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      const firstPet = pets[0];
      setSelectedPet(firstPet);
      
      // Initialize AI service with pet context
      aiService.setCurrentPet(firstPet);
      
      setMessages([getInitialMessage(firstPet.name, firstPet.type, firstPet.breed, firstPet.age)]);
    }
  }, [pets, selectedPet]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || !selectedPet) return;

    // Check for emergency keywords
    const isEmergency = detectEmergency(messageText);
    if (isEmergency) {
      setShowEmergencyBanner(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      petId: selectedPet.id,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowQuickReplies(null);

    try {
      // Call real AI service
      const response = await aiService.sendMessage(messageText);
      
      // Check if AI detected emergency
      if (response.isEmergency) {
        setShowEmergencyBanner(true);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        petId: selectedPet.id,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Show relevant quick replies based on response (not for emergencies)
      if (!isEmergency && !response.isEmergency) {
        const category = detectCategory(messageText);
        setShowQuickReplies(category);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        petId: selectedPet.id,
        role: 'assistant',
        content: `I'm having trouble connecting right now. Please try again in a moment. If this is urgent, please contact your vet directly.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const detectEmergency = (message: string): boolean => {
    const lower = message.toLowerCase();
    return emergencyKeywords.some(keyword => lower.includes(keyword));
  };

  const detectCategory = (message: string): keyof typeof quickReplies | null => {
    const lower = message.toLowerCase();
    if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('nutrition')) {
      return 'diet';
    }
    if (lower.includes('train') || lower.includes('behavior') || lower.includes('bark') || lower.includes('bite')) {
      return 'behavior';
    }
    if (lower.includes('groom') || lower.includes('exercise') || lower.includes('walk') || lower.includes('care')) {
      return 'care';
    }
    if (lower.includes('symptom') || lower.includes('sick') || lower.includes('health') || lower.includes('vet')) {
      return 'health';
    }
    return null;
  };

  const handlePetChange = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetSelector(false);
    setShowEmergencyBanner(false);
    
    // Update AI service with new pet context
    aiService.setCurrentPet(pet);
    
    setMessages([getInitialMessage(pet.name, pet.type, pet.breed, pet.age)]);
  };

  const handleCallVet = () => {
    if (selectedPet?.vetContact?.phone) {
      Linking.openURL(`tel:${selectedPet.vetContact.phone}`);
    }
  };

  const handleCallPoisonControl = () => {
    Linking.openURL('tel:8884264435');
  };

  const handleFindEmergencyClinic = () => {
    // Open maps to search for emergency vet clinics
    const query = 'emergency veterinary clinic near me';
    const url = Platform.OS === 'ios' 
      ? `maps://app?q=${encodeURIComponent(query)}`
      : `geo:0,0?q=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Sparkles size={24} color={colors.primary[600]} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              {selectedPet && (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={`Change pet, currently ${selectedPet.name}`}
                  accessibilityRole="button"
                  style={styles.petSelector}
                  onPress={() => setShowPetSelector(!showPetSelector)}
                >
                  <Text style={styles.petSelectorText}>
                    {selectedPet.type === 'dog' ? '🐕' : '🐈'} {selectedPet.name}
                  </Text>
                  <ChevronDown size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Pet Selector Dropdown */}
        {showPetSelector && (
          <View style={styles.petDropdown}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                accessible={true}
                accessibilityLabel={`Select ${pet.name}`}
                accessibilityRole="button"
                style={[
                  styles.petOption,
                  selectedPet?.id === pet.id && styles.petOptionSelected,
                ]}
                onPress={() => handlePetChange(pet)}
              >
                <Text style={styles.petOptionEmoji}>
                  {pet.type === 'dog' ? '🐕' : '🐈'}
                </Text>
                <View style={styles.petOptionInfo}>
                  <Text style={styles.petOptionName}>{pet.name}</Text>
                  <Text style={styles.petOptionDetails}>
                    {pet.breed} • {pet.age}yo
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Emergency Banner */}
        {showEmergencyBanner && selectedPet && (
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyHeader}>
              <AlertTriangle size={24} color={colors.status.urgent} />
              <Text style={styles.emergencyTitle}>EMERGENCY DETECTED</Text>
            </View>
            <Text style={styles.emergencyText}>
              Get immediate help for {selectedPet.name}
            </Text>
            
            <View style={styles.emergencyActions}>
              {selectedPet.vetContact && (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={`Call ${selectedPet.vetContact.clinicName}`}
                  accessibilityRole="button"
                  style={[styles.emergencyButton, styles.emergencyButtonPrimary]}
                  onPress={handleCallVet}
                >
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.emergencyButtonTextPrimary}>
                    Call Vet
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Call Pet Poison Control"
                accessibilityRole="button"
                style={styles.emergencyButton}
                onPress={handleCallPoisonControl}
              >
                <Phone size={18} color={colors.status.urgent} />
                <Text style={styles.emergencyButtonText}>
                  Poison Control
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Find emergency clinic nearby"
                accessibilityRole="button"
                style={styles.emergencyButton}
                onPress={handleFindEmergencyClinic}
              >
                <MapPin size={18} color={colors.status.urgent} />
                <Text style={styles.emergencyButtonText}>
                  Find Clinic
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Dismiss emergency banner"
              accessibilityRole="button"
              style={styles.dismissButton}
              onPress={() => setShowEmergencyBanner(false)}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Prompts */}
        {messages.length === 1 && selectedPet && (
          <View style={styles.quickPromptsContainer}>
            <Text style={styles.quickPromptsTitle}>Quick questions:</Text>
            <View style={styles.quickPrompts}>
              {quickPrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  accessible={true}
                  accessibilityLabel={prompt}
                  accessibilityRole="button"
                  style={styles.quickPromptChip}
                  onPress={() => handleSend(prompt)}
                >
                  <Text style={styles.quickPromptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.role === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.aiIcon}>
                    <Sparkles size={16} color={colors.primary[600]} />
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.aiMessageWrapper}>
              <View style={[styles.messageBubble, styles.aiMessage]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={colors.primary[600]} />
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Reply Buttons */}
          {!isTyping && showQuickReplies && (
            <View style={styles.quickRepliesContainer}>
              <Text style={styles.quickRepliesTitle}>Quick replies:</Text>
              <View style={styles.quickRepliesGrid}>
                {quickReplies[showQuickReplies].map((reply, index) => (
                  <TouchableOpacity
                    key={index}
                    accessible={true}
                    accessibilityLabel={reply}
                    accessibilityRole="button"
                    style={styles.quickReplyButton}
                    onPress={() => handleSend(reply)}
                  >
                    <Text style={styles.quickReplyText}>{reply}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Take photo"
            accessibilityRole="button"
            style={styles.iconButton}
          >
            <Camera size={20} color={colors.text.secondary} />
          </TouchableOpacity>

          <TextInput
            accessible={true}
            accessibilityLabel="Message input"
            accessibilityHint="Type your question about pet care"
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.text.tertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Voice input"
            accessibilityRole="button"
            style={styles.iconButton}
          >
            <Mic size={20} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Send message"
            accessibilityRole="button"
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#FFFFFF' : colors.neutral[400]} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  petSelectorText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  petDropdown: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    overflow: 'hidden',
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  petOptionSelected: {
    backgroundColor: colors.primary[50],
  },
  petOptionEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  petOptionInfo: {
    flex: 1,
  },
  petOptionName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  petOptionDetails: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  quickPromptsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  quickPromptsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickPromptChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  quickPromptText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary[600],
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  messageWrapper: {
    marginBottom: spacing.lg,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  userMessage: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: spacing.xs,
  },
  aiMessage: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: spacing.xs,
    ...shadows.sm,
  },
  aiIcon: {
    marginBottom: spacing.sm,
  },
  messageText: {
    fontSize: typography.sizes.base,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: colors.text.primary,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  typingText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  iconButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: touchTargets.minimum,
    maxHeight: 100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  sendButton: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  quickRepliesContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  quickRepliesTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickRepliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickReplyButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary[200],
  },
  quickReplyText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary[600],
  },
  emergencyBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.status.urgent + '10',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.status.urgent,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  emergencyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.status.urgent,
  },
  emergencyText: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  emergencyActions: {
    gap: spacing.sm,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.status.urgent,
    gap: spacing.sm,
  },
  emergencyButtonPrimary: {
    backgroundColor: colors.status.urgent,
    borderColor: colors.status.urgent,
  },
  emergencyButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.status.urgent,
  },
  emergencyButtonTextPrimary: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
  dismissButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
