import Constants from 'expo-constants';
import type { Pet } from '@/types/pet';
import { errorHandler } from './errorHandler';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface AIResponse {
  content: string;
  isEmergency: boolean;
}

export class AIService {
  private conversationHistory: GeminiMessage[] = [];
  private currentPet: Pet | null = null;
  private systemInstruction: string = '';

  setCurrentPet(pet: Pet) {
    this.currentPet = pet;
    this.systemInstruction = this.getSystemPrompt(pet);
    // Reset conversation when pet changes
    this.conversationHistory = [];
  }

  private getSystemPrompt(pet: Pet): string {
    const petContext = this.buildPetContext(pet);
    
    return `You are an expert AI veterinary assistant helping pet owners care for their pets. You provide helpful, accurate, and compassionate advice.

${petContext}

IMPORTANT GUIDELINES:
1. Always prioritize pet safety and health
2. Recommend veterinary care for serious symptoms
3. Be clear about what is and isn't an emergency
4. Provide specific, actionable advice
5. Be warm and supportive - pet owners may be worried
6. If you detect emergency keywords (bleeding, seizure, unconscious, poisoning, difficulty breathing, etc.), start your response with "🚨 EMERGENCY:"

RESPONSE FORMAT:
- Keep responses concise but informative (under 300 words)
- Use bullet points for lists
- Include emojis sparingly for readability
- Always consider the specific pet's context (age, breed, allergies, medications)

Remember: You're a helpful assistant, not a replacement for veterinary care. When in doubt, recommend consulting a vet.`;
  }

  private buildPetContext(pet: Pet): string {
    const parts = [
      `CURRENT PET: ${pet.name}`,
      `Type: ${pet.type === 'dog' ? 'Dog' : 'Cat'}`,
      pet.breed && `Breed: ${pet.breed}`,
      pet.age && `Age: ${pet.age} years old`,
      pet.weight && `Weight: ${pet.weight} lbs`,
      pet.allergies?.length && `Known Allergies: ${pet.allergies.join(', ')}`,
      pet.medications?.length && `Current Medications: ${pet.medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join('; ')}`,
      pet.conditions?.length && `Medical Conditions: ${pet.conditions.join(', ')}`,
      pet.vetContact && `Vet: ${pet.vetContact.clinicName} - ${pet.vetContact.phone}`,
    ];

    return parts.filter(Boolean).join('\n');
  }

  async sendMessage(userMessage: string): Promise<AIResponse> {
    if (!this.currentPet) {
      throw new Error('No pet selected. Please select a pet first.');
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        console.warn('No Gemini API key found. Using fallback responses.');
        return this.getFallbackResponse(userMessage);
      }

      const requestBody: any = {
        contents: this.conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
          topK: 40,
        },
      };

      // Add system instruction if available
      if (this.systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: this.systemInstruction }],
        };
      }

      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        errorHandler.handleAPIError(error, response.status, {
          component: 'AIService',
          action: 'sendMessage',
        });
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      
      // Extract response from Gemini format
      const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I had trouble generating a response. Please try again.';

      // Add AI response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: aiMessage }],
      });

      // Keep conversation history manageable (last 10 exchanges = 20 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        content: aiMessage,
        isEmergency: aiMessage.startsWith('🚨 EMERGENCY:'),
      };
    } catch (error) {
      errorHandler.handleNetworkError(error, {
        component: 'AIService',
        action: 'sendMessage',
      });
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): AIResponse {
    const lower = userMessage.toLowerCase();
    const pet = this.currentPet!;
    const petName = pet.name;
    const petType = pet.type === 'dog' ? 'dog' : 'cat';

    // Check for emergency keywords
    const emergencyKeywords = [
      'bleeding', 'blood', 'seizure', 'unconscious', 'choking', 'breathing',
      'poison', 'toxic', 'ate chocolate', 'ate grapes', 'hit by car',
    ];
    
    const isEmergency = emergencyKeywords.some(keyword => lower.includes(keyword));

    if (isEmergency) {
      let vetInfo = '';
      if (pet.vetContact) {
        vetInfo = `\n\n📞 CALL ${petName.toUpperCase()}'S VET NOW:\n${pet.vetContact.clinicName}\n${pet.vetContact.phone}`;
      }
      
      return {
        content: `🚨 EMERGENCY: This sounds serious!\n\n⚠️ IMMEDIATE ACTIONS:\n\n1. Stay calm but act quickly\n2. Call your vet or emergency clinic NOW${vetInfo}\n3. Pet Poison Control: (888) 426-4435\n4. Keep ${petName} calm and safe\n5. Do NOT induce vomiting unless told to\n\nTime is critical. Please seek professional help immediately!`,
        isEmergency: true,
      };
    }

    // Topic-based responses
    if (lower.includes('food') || lower.includes('eat') || lower.includes('diet')) {
      const safeFood = petType === 'dog'
        ? "✅ Safe for dogs:\n• Plain chicken, turkey, beef\n• Carrots, green beans, sweet potato\n• Blueberries, apples (no seeds)\n\n❌ Toxic:\n• Chocolate, grapes, raisins\n• Onions, garlic, xylitol"
        : "✅ Safe for cats:\n• Plain chicken, turkey, fish\n• Cooked eggs\n• Pumpkin\n\n❌ Toxic:\n• Onions, garlic, chocolate\n• Grapes, raisins, xylitol";
      
      return {
        content: `Great question about ${petName}'s diet!\n\n${safeFood}\n\nWhat specific food are you asking about?`,
        isEmergency: false,
      };
    }

    if (lower.includes('train') || lower.includes('behavior')) {
      return {
        content: `Training ${petName} is all about consistency and positive reinforcement!\n\n🎯 Key principles:\n• Use treats and praise immediately\n• Keep sessions short (5-10 min)\n• Be consistent with commands\n• Never use punishment\n\nWhat specific behavior would you like to work on?`,
        isEmergency: false,
      };
    }

    if (lower.includes('symptom') || lower.includes('sick') || lower.includes('health')) {
      return {
        content: `I can help you check ${petName}'s symptoms!\n\nPlease describe:\n• Is ${petName} eating normally?\n• Any vomiting or diarrhea?\n• Changes in energy level?\n• Any visible issues?\n\nIf symptoms are severe or worsening, please contact your vet.`,
        isEmergency: false,
      };
    }

    // Default response
    return {
      content: `I'd be happy to help with ${petName}! Could you provide more details about your question?\n\nI can help with:\n• Health and symptoms\n• Diet and nutrition\n• Training and behavior\n• General care advice`,
      isEmergency: false,
    };
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Singleton instance
export const aiService = new AIService();
