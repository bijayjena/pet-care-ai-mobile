import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, Camera, Mic } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, touchTargets, shadows } from '@/constants/theme';
import type { ChatMessage } from '@/types/pet';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    petId: 'max',
    role: 'assistant',
    content: "Hi! I'm your AI Pet Care Assistant. I can help you with:\n\n• Health questions and symptoms\n• Diet and nutrition advice\n• Training and behavior tips\n• Emergency guidance\n\nWhat would you like to know?",
    timestamp: new Date(),
  },
];

const quickPrompts = [
  '🤒 Check symptoms',
  '🍖 Safe foods',
  '🎾 Training tips',
  '💊 Medication help',
];

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      petId: 'max',
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        petId: 'max',
        role: 'assistant',
        content: getAIResponse(messageText),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('symptom') || lowerQuestion.includes('sick')) {
      return "I can help you check symptoms! Please describe what you're noticing:\n\n• Is your pet eating normally?\n• Any vomiting or diarrhea?\n• Changes in energy level?\n• Any visible issues?\n\nYou can also take a photo using the camera button for a visual assessment.";
    }
    if (lowerQuestion.includes('food') || lowerQuestion.includes('eat')) {
      return "Great question about diet! Here are some safe foods for dogs:\n\n✅ Safe:\n• Plain chicken, turkey, beef\n• Carrots, green beans, sweet potato\n• Blueberries, apples (no seeds)\n• Plain rice and oatmeal\n\n❌ Toxic:\n• Chocolate, grapes, raisins\n• Onions, garlic, chives\n• Xylitol (artificial sweetener)\n• Macadamia nuts\n\nWhat specific food are you asking about?";
    }
    if (lowerQuestion.includes('train') || lowerQuestion.includes('behavior')) {
      return "Training is all about consistency and positive reinforcement! Here are key tips:\n\n🎯 Basic principles:\n• Use treats and praise immediately\n• Keep sessions short (5-10 min)\n• Be consistent with commands\n• Never use punishment\n\n📚 Start with basics:\n1. Sit\n2. Stay\n3. Come\n4. Down\n\nWhat specific behavior would you like to work on?";
    }
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
      return "🚨 For emergencies, please:\n\n1. Call your vet immediately\n2. Or contact Pet Poison Control: 888-426-4435\n3. Find 24/7 emergency clinic nearby\n\n⚠️ Call vet NOW if:\n• Difficulty breathing\n• Unconscious or unresponsive\n• Severe bleeding\n• Seizures\n• Suspected poisoning\n\nIs this an emergency? I can help you find immediate care.";
    }
    
    return "I'd be happy to help with that! Could you provide more details so I can give you the best advice? You can also:\n\n• Take a photo for symptom analysis\n• Use voice input for faster questions\n• Ask about specific concerns\n\nWhat would you like to know more about?";
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
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>Always here to help</Text>
            </View>
          </View>
        </View>

        {/* Quick Prompts */}
        {messages.length === 1 && (
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
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
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
  headerSubtitle: {
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
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.tertiary,
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
});
