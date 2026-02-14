# AI Service Setup

The AI Assistant uses Google's Gemini 1.5 Flash model to provide intelligent, context-aware pet care advice.

## Features

- Real-time AI responses with pet-specific context
- Conversation history management
- Emergency detection
- Automatic fallback to mock responses if API key is not configured
- Fast and cost-effective (Gemini 1.5 Flash)
- Generous free tier

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 2. Add API Key to Environment

Add your API key to the `.env` file:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here
```

### 3. Restart the Development Server

After adding the API key, restart your Expo development server:

```bash
npm run dev
```

## How It Works

### Pet Context Injection

The AI service automatically includes:
- Pet name, type, breed, age, weight
- Known allergies
- Current medications
- Medical conditions
- Vet contact information

### Conversation History

- Maintains last 20 messages (10 exchanges) for context
- Resets when switching pets
- System instruction includes pet-specific information

### Emergency Detection

The AI is instructed to:
- Detect emergency keywords in user messages
- Start responses with "🚨 EMERGENCY:" for urgent situations
- Provide immediate action steps
- Include vet contact information

### Fallback Behavior

If no API key is configured or the API fails:
- Automatically falls back to rule-based responses
- Provides topic-specific advice (diet, training, health)
- Maintains emergency detection
- No degradation in user experience

## Cost Considerations

### Gemini 1.5 Flash Pricing

**Free Tier (Generous):**
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

**Paid Tier (if needed):**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Much cheaper than OpenAI

### Estimated Costs
- Average conversation: 10-20 messages
- Most users will stay within free tier
- If exceeding free tier: ~$0.005-0.01 per conversation
- 1000 conversations: ~$5-10 (vs $10-20 with OpenAI)

### Cost Optimization
- Conversation history limited to 20 messages
- Max tokens set to 500 per response
- System instruction optimized for conciseness
- Using Flash model (fastest and cheapest)

## API Configuration

The service can be configured in `services/aiService.ts`:

```typescript
// Change model (if needed)
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
// Options: gemini-1.5-flash, gemini-1.5-pro, gemini-pro

// Adjust response parameters
generationConfig: {
  temperature: 0.7,        // 0.0 = deterministic, 1.0 = creative
  maxOutputTokens: 500,    // Increase for longer responses
  topP: 0.95,              // Nucleus sampling
  topK: 40,                // Top-k sampling
}
```

## Gemini API Features

### Advantages over OpenAI
- **Free tier**: Very generous limits for development
- **Cost**: 50% cheaper than GPT-4o-mini
- **Speed**: Gemini 1.5 Flash is optimized for speed
- **Context**: Large context window (1M tokens)
- **Multimodal**: Can handle images (future feature)

### API Structure
- Uses `contents` array for conversation history
- Separate `systemInstruction` for context
- Response in `candidates[0].content.parts[0].text`

## Testing Without API Key

The service works without an API key using intelligent fallback responses:

1. Emergency detection still works
2. Topic-based responses (diet, training, health)
3. Pet context still included
4. All UI features functional

This allows development and testing without incurring API costs.

## Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- API key is only used client-side (consider backend proxy for production)
- Rate limiting is handled by Google

## Future Enhancements

### Image Analysis (Multimodal)
Gemini supports image input, which could be used for:
- Symptom analysis from photos
- Skin condition assessment
- Injury evaluation

Example implementation:
```typescript
contents: [{
  role: 'user',
  parts: [
    { text: 'What is this rash?' },
    { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
  ]
}]
```

### Safety Settings
Can be configured to filter harmful content:
```typescript
safetySettings: [
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
  }
]
```

## Troubleshooting

### API Key Not Working
- Ensure key is correctly copied (no extra spaces)
- Check API is enabled in Google Cloud Console
- Verify you haven't exceeded rate limits

### Rate Limit Errors
- Free tier: 15 requests/minute, 1500/day
- Add delay between requests if needed
- Consider upgrading to paid tier

### Response Quality
- Adjust temperature (0.7 is balanced)
- Modify system instruction for better context
- Increase maxOutputTokens for longer responses

## Alternative Models

### Gemini 1.5 Pro
- More capable but slower
- Better for complex medical questions
- Higher cost

### Gemini Pro
- Previous generation
- Still capable but less efficient
- Consider if Flash has issues
